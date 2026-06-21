import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCashBookStore } from '../../../application/stores/cash-book.store';
import { formatCurrency } from '../../../shared/utils/format';
import { spacing, fontSize, shadows } from '../../../shared/constants/spacing';
import * as Print from 'expo-print';

const screenWidth = Dimensions.get('window').width;

export function CashBookScreen() {
  const { colors, isDark } = useTheme();
  const { items, fetchAll, createEntry, removeEntry, clearAll } = useCashBookStore();

  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddEntry = async () => {
    if (!amount) {
      Alert.alert('Eror', 'Masukkan nominal');
      return;
    }

    const amt = parseFloat(amount) || 0;

    await createEntry({
      type,
      amount: amt,
      source: 'MANUAL',
      referenceId: null,
      notes: notes || (type === 'INCOME' ? 'Pemasukan Manual' : 'Pengeluaran Manual'),
      date: new Date().toISOString().split('T')[0],
    });

    setAmount('');
    setNotes('');
    setShowAddForm(false);
    Alert.alert('Sukses', 'Catatan buku kas ditambahkan!');
  };

  const exportPdf = async () => {
    if (items.length === 0) {
      Alert.alert('Eror', 'Belum ada data transaksi untuk diekspor');
      return;
    }

    const html = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { text-align: center; color: #0ea5e9; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #0ea5e9; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .income { color: #22c55e; font-weight: bold; }
            .expense { color: #ef4444; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>LAPORAN BULANAN BUKU KAS</h1>
          <p>Dicetak pada: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis</th>
                <th>Keterangan</th>
                <th>Sumber</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td>${item.date}</td>
                  <td class="${item.type === 'INCOME' ? 'income' : 'expense'}">${item.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}</td>
                  <td>${item.notes || '-'}</td>
                  <td>${item.source}</td>
                  <td>${formatCurrency(item.amount)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    await Print.printAsync({ html });
  };

  const totalIncome = items.filter((i) => i.type === 'INCOME').reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = items.filter((i) => i.type === 'EXPENSE').reduce((sum, i) => sum + i.amount, 0);
  const netCash = totalIncome - totalExpense;

  // Prepare chart data (last 7 entries or grouped by date)
  const chartData = {
    labels: items.slice(0, 6).reverse().map((i) => i.date.substring(5)),
    datasets: [
      {
        data: items.slice(0, 6).reverse().map((i) => (i.type === 'INCOME' ? i.amount : -i.amount)),
        color: (opacity = 1) => colors.primary[500],
        strokeWidth: 3,
      },
    ],
  };

  const inputTextColor = isDark ? colors.white : colors.gray[900];
  const inputBgColor = isDark ? colors.gray[800] : colors.gray[100];
  const labelColor = isDark ? colors.gray[300] : colors.gray[600];

  const chartConfig = {
    backgroundColor: isDark ? colors.gray[800] : colors.white,
    backgroundGradientFrom: isDark ? colors.gray[800] : colors.white,
    backgroundGradientTo: isDark ? colors.gray[800] : colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary[400],
    labelColor: (opacity = 1) => inputTextColor,
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: inputTextColor }]}>Buku Kas Digital</Text>
          <View style={styles.headerActions}>
            <Button
              title="Ekspor PDF"
              variant="outline"
              size="sm"
              icon="document-text-outline"
              style={{ marginRight: 8 }}
              onPress={exportPdf}
            />
            <Button
              title={showAddForm ? 'Tutup' : 'Catat Kas'}
              variant={showAddForm ? 'outline' : 'primary'}
              size="sm"
              onPress={() => setShowAddForm(!showAddForm)}
            />
          </View>
        </View>

        {/* Add Entry Form */}
        {showAddForm && (
          <Card padding="lg" style={styles.card}>
            <Text style={[styles.sectionTitle, { color: inputTextColor }]}>Catat Arus Kas Baru</Text>

            <Text style={[styles.label, { color: labelColor }]}>Jenis Transaksi</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                onPress={() => setType('INCOME')}
                style={[
                  styles.typeBtn,
                  type === 'INCOME' ? { backgroundColor: colors.green[500] } : { backgroundColor: inputBgColor },
                ]}
              >
                <Text style={{ color: type === 'INCOME' ? 'white' : inputTextColor, fontWeight: '700' }}>Pemasukan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType('EXPENSE')}
                style={[
                  styles.typeBtn,
                  type === 'EXPENSE' ? { backgroundColor: colors.red[500] } : { backgroundColor: inputBgColor },
                ]}
              >
                <Text style={{ color: type === 'EXPENSE' ? 'white' : inputTextColor, fontWeight: '700' }}>Pengeluaran</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: labelColor, marginTop: spacing.sm }]}>Nominal (Rp)</Text>
            <TextInput
              placeholder="0"
              placeholderTextColor={colors.gray[400]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
            />

            <Text style={[styles.label, { color: labelColor, marginTop: spacing.sm }]}>Keterangan / Catatan</Text>
            <TextInput
              placeholder="Keterangan transaksi..."
              placeholderTextColor={colors.gray[400]}
              value={notes}
              onChangeText={setNotes}
              style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
            />

            <Button
              title="Simpan Transaksi"
              variant="primary"
              size="md"
              style={{ marginTop: spacing.md }}
              onPress={handleAddEntry}
            />
          </Card>
        )}

        {/* Financial Summary */}
        <View style={styles.statsRow}>
          <Card padding="md" style={[styles.statCard, { backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>
            <Text style={{ color: labelColor, fontSize: fontSize.xs }}>Total Pemasukan</Text>
            <Text style={[styles.statValue, { color: colors.green[600] }]}>{formatCurrency(totalIncome)}</Text>
          </Card>
          <View style={{ width: spacing.md }} />
          <Card padding="md" style={[styles.statCard, { backgroundColor: 'rgba(239, 68, 68, 0.08)' }]}>
            <Text style={{ color: labelColor, fontSize: fontSize.xs }}>Total Pengeluaran</Text>
            <Text style={[styles.statValue, { color: colors.red[500] }]}>{formatCurrency(totalExpense)}</Text>
          </Card>
        </View>

        <Card padding="lg" style={styles.card}>
          <Text style={{ color: labelColor, fontSize: fontSize.xs }}>Saldo Kas Bersih</Text>
          <Text style={{ fontSize: fontSize.xl, fontWeight: '800', color: colors.primary[500], marginTop: 4 }}>
            {formatCurrency(netCash)}
          </Text>
        </Card>

        {/* Chart View */}
        {items.length > 1 && (
          <Card padding="md" style={styles.card}>
            <Text style={[styles.sectionTitle, { color: inputTextColor, marginBottom: spacing.md }]}>Arus Kas Terkini</Text>
            <LineChart
              data={chartData}
              width={screenWidth - spacing.md * 4}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 16 }}
            />
          </Card>
        )}

        {/* Transaction History log list */}
        <Text style={[styles.sectionTitle, { color: inputTextColor, marginVertical: spacing.sm }]}>Riwayat Transaksi</Text>
        {items.length === 0 ? (
          <Text style={[styles.empty, { color: labelColor }]}>Belum ada data transaksi kas.</Text>
        ) : (
          items.map((item) => (
            <Card key={item.id} padding="md" style={styles.entryRow}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.entryNotes, { color: inputTextColor }]}>{item.notes}</Text>
                  <Text style={{ color: labelColor, fontSize: fontSize.xs }}>{item.date} • {item.source}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: '700', color: item.type === 'INCOME' ? colors.green[600] : colors.red[500] }}>
                    {item.type === 'INCOME' ? '+' : '-'} {formatCurrency(item.amount)}
                  </Text>
                  <TouchableOpacity onPress={() => removeEntry(item.id)} style={{ marginTop: 4 }}>
                    <Ionicons name="trash-outline" size={16} color={colors.red[400]} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))
        )}

        {items.length > 0 && (
          <Button
            title="Reset Seluruh Buku Kas"
            variant="danger"
            size="md"
            style={{ marginTop: spacing.lg }}
            onPress={() => {
              Alert.alert('Konfirmasi', 'Hapus semua riwayat transaksi buku kas?', [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus Semua', style: 'destructive', onPress: clearAll },
              ]);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: fontSize.xl, fontWeight: '800' },
  card: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm },
  label: { fontSize: fontSize.sm, fontWeight: '600', marginBottom: 4 },
  input: { padding: spacing.sm, borderRadius: 12, fontSize: fontSize.sm, marginBottom: spacing.xs },
  typeSelector: { flexDirection: 'row', marginVertical: spacing.xs },
  typeBtn: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  statsRow: { flexDirection: 'row', marginBottom: spacing.md },
  statCard: { flex: 1 },
  statValue: { fontSize: fontSize.md, fontWeight: '800', marginTop: 4 },
  entryRow: { marginBottom: spacing.xs },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryNotes: { fontSize: fontSize.sm, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: spacing.md, fontSize: fontSize.sm },
});
