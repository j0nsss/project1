import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useDebtStore } from '../../../application/stores/debt.store';
import { useCashBookStore } from '../../../application/stores/cash-book.store';
import { formatCurrency } from '../../../shared/utils/format';
import { spacing, fontSize, shadows } from '../../../shared/constants/spacing';

export function DebtsScreen() {
  const { colors, isDark } = useTheme();
  const { items, fetchAll, createDebt, updateDebt, removeDebt } = useDebtStore();
  const addCashEntry = useCashBookStore((s) => s.createEntry);

  const [activeTab, setActiveTab] = useState<'RECEIVABLE' | 'DEBT'>('RECEIVABLE');
  const [customerName, setCustomerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddDebt = async () => {
    if (!customerName || !amount) {
      Alert.alert('Eror', 'Nama pelanggan dan Nominal harus diisi');
      return;
    }

    const amt = parseFloat(amount) || 0;

    await createDebt({
      customerName,
      contactInfo: contactInfo || null,
      amount: amt,
      paidAmount: 0,
      type: activeTab,
      status: 'UNPAID',
      dueDate: dueDate || null,
      notes: notes || null,
    });

    // Reset Form
    setCustomerName('');
    setContactInfo('');
    setAmount('');
    setNotes('');
    setDueDate('');
    setShowAddForm(false);
    Alert.alert('Sukses', 'Catatan Bon berhasil dibuat!');
  };

  const handlePayPartial = (debt: any) => {
    Alert.prompt(
      'Cicil Pembayaran',
      `Masukkan jumlah pembayaran untuk ${debt.customerName}:`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Bayar',
          onPress: async (val?: string) => {
            const payAmt = parseFloat(val || '0') || 0;
            if (payAmt <= 0) return;
            const newPaid = debt.paidAmount + payAmt;
            const remaining = debt.amount - newPaid;
            const newStatus = remaining <= 0 ? 'PAID' : 'UNPAID';

            await updateDebt(debt.id, {
              paidAmount: Math.min(newPaid, debt.amount),
              status: newStatus,
            });

            // Auto log payment to Cash Book!
            await addCashEntry({
              type: debt.type === 'RECEIVABLE' ? 'INCOME' : 'EXPENSE',
              amount: payAmt,
              source: 'DEBT_PAYMENT',
              referenceId: debt.id,
              notes: `Cicilan Bon: ${debt.customerName} (${debt.type === 'RECEIVABLE' ? 'Piutang' : 'Utang'})`,
              date: new Date().toISOString(),
            });

            Alert.alert('Sukses', 'Pembayaran berhasil dicatat & masuk Buku Kas!');
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const filteredItems = items.filter((i) => i.type === activeTab);
  const totalOutstanding = filteredItems
    .filter((i) => i.status === 'UNPAID')
    .reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);

  const inputTextColor = isDark ? colors.white : colors.gray[900];
  const inputBgColor = isDark ? colors.gray[800] : colors.gray[100];
  const labelColor = isDark ? colors.gray[300] : colors.gray[600];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: inputTextColor }]}>Buku Utang / Piutang (Bon)</Text>
          <Button
            title={showAddForm ? 'Tutup' : 'Catat Bon Baru'}
            variant={showAddForm ? 'outline' : 'primary'}
            size="sm"
            onPress={() => setShowAddForm(!showAddForm)}
          />
        </View>

        {/* Form Add */}
        {showAddForm && (
          <Card padding="lg" style={styles.card}>
            <Text style={[styles.sectionTitle, { color: inputTextColor }]}>Catat Transaksi Bon Baru</Text>

            <Text style={[styles.label, { color: labelColor }]}>Nama Pelanggan / Kontak</Text>
            <TextInput
              placeholder="Masukkan nama"
              placeholderTextColor={colors.gray[400]}
              value={customerName}
              onChangeText={setCustomerName}
              style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
            />

            <Text style={[styles.label, { color: labelColor, marginTop: spacing.sm }]}>Nomor Kontak (WhatsApp)</Text>
            <TextInput
              placeholder="081xxx (opsional)"
              placeholderTextColor={colors.gray[400]}
              value={contactInfo}
              onChangeText={setContactInfo}
              keyboardType="phone-pad"
              style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
            />

            <Text style={[styles.label, { color: labelColor, marginTop: spacing.sm }]}>Nominal Bon (Rp)</Text>
            <TextInput
              placeholder="0"
              placeholderTextColor={colors.gray[400]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
            />

            <Text style={[styles.label, { color: labelColor, marginTop: spacing.sm }]}>Tanggal Jatuh Tempo</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.gray[400]}
              value={dueDate}
              onChangeText={setDueDate}
              style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
            />

            <Text style={[styles.label, { color: labelColor, marginTop: spacing.sm }]}>Catatan Tambahan</Text>
            <TextInput
              placeholder="Keterangan bon..."
              placeholderTextColor={colors.gray[400]}
              value={notes}
              onChangeText={setNotes}
              style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
            />

            <Button
              title="Simpan Catatan Bon"
              variant="primary"
              size="md"
              style={{ marginTop: spacing.md }}
              onPress={handleAddDebt}
            />
          </Card>
        )}

        {/* Tab switch Utang vs Piutang */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'RECEIVABLE' && { borderBottomColor: colors.primary[500], borderBottomWidth: 3 }]}
            onPress={() => setActiveTab('RECEIVABLE')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'RECEIVABLE' ? colors.primary[500] : labelColor }]}>
              Piutang (Kita Tagih)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'DEBT' && { borderBottomColor: colors.primary[500], borderBottomWidth: 3 }]}
            onPress={() => setActiveTab('DEBT')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'DEBT' ? colors.primary[500] : labelColor }]}>
              Utang (Kita Bayar)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <Card padding="lg" style={[styles.card, { backgroundColor: activeTab === 'RECEIVABLE' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)' }]}>
          <Text style={{ color: labelColor, fontSize: fontSize.sm }}>Total Belum Terbayar ({activeTab === 'RECEIVABLE' ? 'Piutang' : 'Utang'})</Text>
          <Text style={{ fontSize: fontSize.xl, fontWeight: '800', color: activeTab === 'RECEIVABLE' ? colors.green[600] : colors.red[500], marginTop: 4 }}>
            {formatCurrency(totalOutstanding)}
          </Text>
        </Card>

        {/* List items */}
        {filteredItems.length === 0 ? (
          <Text style={[styles.empty, { color: labelColor }]}>Belum ada catatan bon di kategori ini.</Text>
        ) : (
          filteredItems.map((item) => {
            const rem = item.amount - item.paidAmount;
            return (
              <Card key={item.id} padding="lg" style={styles.debtCard}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={[styles.debtName, { color: inputTextColor }]}>{item.customerName}</Text>
                    {item.contactInfo && <Text style={{ color: labelColor, fontSize: fontSize.xs }}>WA: {item.contactInfo}</Text>}
                  </View>
                  <Badge variant={item.status === 'PAID' ? 'success' : 'warning'} label={item.status === 'PAID' ? 'Lunas' : 'Belum Lunas'} />
                </View>

                <View style={styles.divider} />

                <View style={styles.rowBetween}>
                  <Text style={{ color: labelColor, fontSize: fontSize.sm }}>Total Bon:</Text>
                  <Text style={{ color: inputTextColor, fontWeight: '600' }}>{formatCurrency(item.amount)}</Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={{ color: labelColor, fontSize: fontSize.sm }}>Sudah Dibayar:</Text>
                  <Text style={{ color: colors.green[600], fontWeight: '600' }}>{formatCurrency(item.paidAmount)}</Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={{ color: labelColor, fontSize: fontSize.sm }}>Sisa Tagihan:</Text>
                  <Text style={{ color: colors.red[500], fontWeight: '700' }}>{formatCurrency(rem)}</Text>
                </View>

                {item.dueDate && (
                  <Text style={{ color: colors.yellow[600], fontSize: fontSize.xs, marginTop: 4 }}>
                    Jatuh Tempo: {item.dueDate}
                  </Text>
                )}

                {item.status === 'UNPAID' && (
                  <View style={styles.cardActions}>
                    <Button
                      title="Cicil / Bayar"
                      variant="primary"
                      size="sm"
                      icon="cash-outline"
                      onPress={() => handlePayPartial(item)}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('Konfirmasi', 'Hapus catatan bon ini?', [
                          { text: 'Batal', style: 'cancel' },
                          { text: 'Hapus', style: 'destructive', onPress: () => removeDebt(item.id) },
                        ]);
                      }}
                      style={styles.deleteBtn}
                    >
                      <Ionicons name="trash-outline" size={20} color={colors.red[500]} />
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  title: { fontSize: fontSize.xl, fontWeight: '800' },
  card: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm },
  label: { fontSize: fontSize.sm, fontWeight: '600', marginBottom: 4 },
  input: { padding: spacing.sm, borderRadius: 12, fontSize: fontSize.sm, marginBottom: spacing.xs },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontWeight: '700', fontSize: fontSize.sm },
  empty: { textAlign: 'center', marginTop: spacing.xl, fontSize: fontSize.sm },
  debtCard: { marginBottom: spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 2 },
  debtName: { fontSize: fontSize.md, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: spacing.sm },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  deleteBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#fee2e2' },
});
