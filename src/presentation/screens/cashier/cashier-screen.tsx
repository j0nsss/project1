import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useProductStore } from '../../../application/stores/product.store';
import { useCashBookStore } from '../../../application/stores/cash-book.store';
import { formatCurrency } from '../../../shared/utils/format';
import { spacing, fontSize, shadows } from '../../../shared/constants/spacing';
import * as Print from 'expo-print';

const SUGGESTED_CASH = [5000, 10000, 20000, 50000, 100000];

export function CashierScreen() {
  const { colors, isDark } = useTheme();
  const products = useProductStore((s) => s.items);
  const addCashEntry = useCashBookStore((s) => s.createEntry);

  const [cart, setCart] = useState<{ product: any; qty: number }[]>([]);
  const [cashReceived, setCashReceived] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');

  const totalBelanja = cart.reduce((sum, item) => sum + (item.product.sellingPrice || 0) * item.qty, 0);
  const changeValue = Math.max(0, (parseFloat(cashReceived) || 0) - totalBelanja);

  const addToCart = (product: any) => {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) {
      setCart(cart.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([...cart, { product, qty: 1 }]);
    }
  };

  const removeFromCart = (product: any) => {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing && existing.qty > 1) {
      setCart(cart.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty - 1 } : i)));
    } else {
      setCart(cart.filter((i) => i.product.id !== product.id));
    }
  };

  const addCustomItem = () => {
    if (!customItemName || !customItemPrice) return;
    const price = parseFloat(customItemPrice) || 0;
    const item = {
      id: Math.random().toString(),
      name: customItemName,
      sellingPrice: price,
      isActive: true,
    };
    setCart([...cart, { product: item, qty: 1 }]);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  // Denominations suggested
  const getDenominations = (amount: number) => {
    if (amount <= 0) return [];
    const coins = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500];
    const breakdown: { note: number; qty: number }[] = [];
    let rem = amount;
    for (const coin of coins) {
      if (rem >= coin) {
        const qty = Math.floor(rem / coin);
        breakdown.push({ note: coin, qty });
        rem = rem % coin;
      }
    }
    return breakdown;
  };

  const handleCheckout = async (recordToCashBook: boolean = false) => {
    if (cart.length === 0) {
      Alert.alert('Eror', 'Keranjang masih kosong');
      return;
    }

    if (recordToCashBook) {
      await addCashEntry({
        type: 'INCOME',
        amount: totalBelanja,
        source: 'CALCULATION',
        referenceId: null,
        notes: `Penjualan Kasir: ${cart.map(i => `${i.product.name} (x${i.qty})`).join(', ')}`,
        date: new Date().toISOString(),
      });
      Alert.alert('Sukses', 'Arus kas masuk berhasil disimpan ke Buku Kas!');
    }
  };

  const shareReceipt = async () => {
    if (cart.length === 0) return;
    let text = `*NOTA BELANJA DIGITAL*\n`;
    text += `------------------------------------\n`;
    cart.forEach((i) => {
      text += `${i.product.name} x${i.qty} = ${formatCurrency((i.product.sellingPrice || 0) * i.qty)}\n`;
    });
    text += `------------------------------------\n`;
    text += `*TOTAL:* ${formatCurrency(totalBelanja)}\n`;
    if (cashReceived) {
      text += `*BAYAR:* ${formatCurrency(parseFloat(cashReceived) || 0)}\n`;
      text += `*KEMBALIAN:* ${formatCurrency(changeValue)}\n`;
    }
    text += `\n_Terima kasih telah berbelanja!_`;

    try {
      await Share.share({ message: text });
    } catch (err) {
      console.log(err);
    }
  };

  const printReceipt = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: monospace; padding: 20px; }
            h2 { text-align: center; margin-bottom: 5px; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .row { display: flex; justify-content: space-between; }
            .total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <h2>NOTA DIGITAL</h2>
          <p style="text-align: center;">Tanggal: ${new Date().toLocaleDateString()}</p>
          <div class="divider"></div>
          ${cart
            .map(
              (i) => `
            <div class="row">
              <span>${i.product.name} x${i.qty}</span>
              <span>${formatCurrency((i.product.sellingPrice || 0) * i.qty)}</span>
            </div>
          `
            )
            .join('')}
          <div class="divider"></div>
          <div class="row total">
            <span>TOTAL</span>
            <span>${formatCurrency(totalBelanja)}</span>
          </div>
          ${
            cashReceived
              ? `
            <div class="row">
              <span>BAYAR</span>
              <span>${formatCurrency(parseFloat(cashReceived) || 0)}</span>
            </div>
            <div class="row">
              <span>KEMBALIAN</span>
              <span>${formatCurrency(changeValue)}</span>
            </div>
          `
              : ''
          }
          <div class="divider"></div>
          <p style="text-align: center;">Terima Kasih</p>
        </body>
      </html>
    `;
    await Print.printAsync({ html });
  };

  const inputTextColor = isDark ? colors.white : colors.gray[900];
  const inputBgColor = isDark ? colors.gray[800] : colors.gray[100];
  const labelColor = isDark ? colors.gray[300] : colors.gray[600];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: inputTextColor }]}>Mesin Kasir & Struk</Text>
        <Text style={[styles.subtitle, { color: labelColor }]}>
          Pilih produk terdaftar atau buat item kustom untuk nota & kalkulator kembalian
        </Text>

        <Card padding="lg" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: inputTextColor }]}>Keranjang Nota</Text>
          {cart.length === 0 ? (
            <Text style={[styles.emptyCart, { color: labelColor }]}>Keranjang kosong. Ketuk produk di bawah untuk menambahkan.</Text>
          ) : (
            <View>
              {cart.map((item, idx) => (
                <View key={idx} style={styles.cartRow}>
                  <Text style={[styles.cartName, { color: inputTextColor }]}>{item.product.name} (x{item.qty})</Text>
                  <View style={styles.cartActions}>
                    <TouchableOpacity onPress={() => removeFromCart(item.product)} style={styles.qtyBtn}>
                      <Ionicons name="remove-circle-outline" size={24} color={colors.red[500]} />
                    </TouchableOpacity>
                    <Text style={[styles.cartPrice, { color: inputTextColor }]}>
                      {formatCurrency((item.product.sellingPrice || 0) * item.qty)}
                    </Text>
                    <TouchableOpacity onPress={() => addToCart(item.product)} style={styles.qtyBtn}>
                      <Ionicons name="add-circle-outline" size={24} color={colors.green[500]} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: inputTextColor }]}>Total Belanja</Text>
                <Text style={[styles.totalValue, { color: colors.primary[500] }]}>{formatCurrency(totalBelanja)}</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Custom Input */}
        <Card padding="lg" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: inputTextColor }]}>Item Kustom Manual</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="Nama Item"
              placeholderTextColor={colors.gray[400]}
              value={customItemName}
              onChangeText={setCustomItemName}
              style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor, flex: 2 }]}
            />
            <View style={{ width: spacing.xs }} />
            <TextInput
              placeholder="Harga"
              placeholderTextColor={colors.gray[400]}
              value={customItemPrice}
              onChangeText={setCustomItemPrice}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor, flex: 1 }]}
            />
            <View style={{ width: spacing.xs }} />
            <Button variant="primary" size="md" icon="add" onPress={addCustomItem} title="" />
          </View>
        </Card>

        {/* Change Calculator */}
        <Card padding="lg" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: inputTextColor }]}>Kalkulator Kembalian Cepat</Text>
          <TextInput
            placeholder="Jumlah Uang Diterima (Bayar)"
            placeholderTextColor={colors.gray[400]}
            value={cashReceived}
            onChangeText={setCashReceived}
            keyboardType="numeric"
            style={[styles.largeInput, { backgroundColor: inputBgColor, color: inputTextColor }]}
          />
          <View style={styles.suggestedCashContainer}>
            {SUGGESTED_CASH.map((cash) => (
              <TouchableOpacity
                key={cash}
                onPress={() => setCashReceived(cash.toString())}
                style={[styles.suggestedBtn, { backgroundColor: colors.primary[50] }]}
              >
                <Text style={{ color: colors.primary[600], fontWeight: '700' }}>{formatCurrency(cash)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {parseFloat(cashReceived) >= totalBelanja && (
            <View style={styles.changeResult}>
              <Text style={[styles.changeLabel, { color: labelColor }]}>Kembalian:</Text>
              <Text style={styles.changeValueText}>{formatCurrency(changeValue)}</Text>

              {changeValue > 0 && (
                <View style={styles.denominationBox}>
                  <Text style={[styles.denomTitle, { color: inputTextColor }]}>Pecahan Kembalian Disarankan:</Text>
                  {getDenominations(changeValue).map((item, idx) => (
                    <Text key={idx} style={[styles.denomItem, { color: labelColor }]}>
                      • {item.qty} Lembar / Koin Rp{item.note.toLocaleString()}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionBlock}>
          <Button
            title="Bagikan ke WhatsApp"
            variant="primary"
            size="lg"
            icon="logo-whatsapp"
            style={{ marginBottom: spacing.sm, backgroundColor: '#25D366' }}
            onPress={shareReceipt}
          />
          <Button
            title="Cetak / Unduh PDF Nota"
            variant="primary"
            size="lg"
            icon="print-outline"
            style={{ marginBottom: spacing.sm }}
            onPress={printReceipt}
          />
          <Button
            title="Simpan Ke Buku Kas Digital"
            variant="outline"
            size="lg"
            icon="save-outline"
            style={{ marginBottom: spacing.sm }}
            onPress={() => handleCheckout(true)}
          />
        </View>

        {/* List of Products selection */}
        <Text style={[styles.sectionTitle, { color: inputTextColor, marginTop: spacing.lg }]}>Daftar Produk Terdaftar</Text>
        <View style={styles.productsGrid}>
          {products.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.productGridItem, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}
              onPress={() => addToCart(p)}
            >
              <Text style={[styles.productGridName, { color: inputTextColor }]} numberOfLines={1}>{p.name}</Text>
              <Text style={{ color: colors.primary[500], fontWeight: '700' }}>{formatCurrency(p.sellingPrice || 0)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md },
  title: { fontSize: fontSize.xl, fontWeight: '800', marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.sm, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm },
  emptyCart: { textAlign: 'center', marginVertical: spacing.md, fontSize: fontSize.sm },
  cartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: spacing.xs },
  cartName: { fontSize: fontSize.sm, flex: 1 },
  cartActions: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { padding: 4 },
  cartPrice: { fontSize: fontSize.sm, fontWeight: '600', minWidth: 80, textAlign: 'right', marginHorizontal: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: fontSize.md, fontWeight: '700' },
  totalValue: { fontSize: fontSize.lg, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: { padding: spacing.sm, borderRadius: 12, fontSize: fontSize.sm },
  largeInput: { padding: spacing.md, borderRadius: 12, fontSize: fontSize.md, fontWeight: '700', textAlign: 'center' },
  suggestedCashContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm, justifyContent: 'center' },
  suggestedBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, margin: 4 },
  changeResult: { marginTop: spacing.md, alignItems: 'center' },
  changeLabel: { fontSize: fontSize.sm },
  changeValueText: { fontSize: fontSize.xl, fontWeight: '800', color: '#10B981', marginTop: 4 },
  denominationBox: { marginTop: spacing.md, alignSelf: 'stretch', padding: spacing.sm, backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 12 },
  denomTitle: { fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.xs },
  denomItem: { fontSize: fontSize.sm, marginVertical: 2 },
  actionBlock: { marginVertical: spacing.sm },
  actionButton: { marginBottom: spacing.sm },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: spacing.xs },
  productGridItem: { width: '48%', padding: spacing.md, borderRadius: 16, marginBottom: spacing.sm, ...shadows.sm },
  productGridName: { fontSize: fontSize.sm, fontWeight: '600', marginBottom: 4 },
});
