import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { formatCurrency } from '../../../shared/utils/format';
import { spacing, fontSize, shadows } from '../../../shared/constants/spacing';

const MARKETPLACES = [
  {
    name: 'Shopee',
    categories: [
      { name: 'Non-Star (Kat A: 6.0%)', rate: 0.06 },
      { name: 'Star/Star+ (Kat A: 4.7%)', rate: 0.047 },
      { name: 'Mall (Kat A: 8.5%)', rate: 0.085 },
    ],
  },
  {
    name: 'Tokopedia',
    categories: [
      { name: 'Regular Merchant (Tier 1: 5.5%)', rate: 0.055 },
      { name: 'Power Merchant (Tier 1: 4.5%)', rate: 0.045 },
      { name: 'Power Merchant PRO (Tier 1: 3.8%)', rate: 0.038 },
    ],
  },
  {
    name: 'TikTok Shop / Lazada',
    categories: [
      { name: 'Kategori Standard (4.0%)', rate: 0.04 },
      { name: 'Kategori Spesial (6.5%)', rate: 0.065 },
    ],
  },
];

export function MarketplaceFeesScreen() {
  const { colors, isDark } = useTheme();
  const [selectedMpIndex, setSelectedMpIndex] = useState(0);
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);
  const [sellingPrice, setSellingPrice] = useState('');
  const [freeShippingRate, setFreeShippingRate] = useState('0'); // e.g. Gratis Ongkir XTRA (4%)
  const [cashbackRate, setCashbackRate] = useState('0'); // e.g. Cashback XTRA (2%)

  const selectedMp = MARKETPLACES[selectedMpIndex];
  const selectedCat = selectedMp.categories[selectedCatIndex];

  const priceNum = parseFloat(sellingPrice) || 0;
  const baseRate = selectedCat.rate;
  const fsRate = (parseFloat(freeShippingRate) || 0) / 100;
  const cbRate = (parseFloat(cashbackRate) || 0) / 100;

  const totalFeePercent = baseRate + fsRate + cbRate;
  const adminFeeAmount = priceNum * totalFeePercent;
  const netPayout = priceNum - adminFeeAmount;

  const inputTextColor = isDark ? colors.white : colors.gray[900];
  const inputBgColor = isDark ? colors.gray[800] : colors.gray[100];
  const labelColor = isDark ? colors.gray[300] : colors.gray[600];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: inputTextColor }]}>Kalkulator Admin Marketplace</Text>
        <Text style={[styles.subtitle, { color: labelColor }]}>
          Hitung potongan biaya admin e-commerce & diskon promo secara real-time untuk menentukan keuntungan bersih Anda.
        </Text>

        {/* Marketplace Selection */}
        <Card padding="lg" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: inputTextColor }]}>Pilih Marketplace</Text>
          <View style={styles.tabContainer}>
            {MARKETPLACES.map((mp, idx) => (
              <TouchableOpacity
                key={mp.name}
                onPress={() => {
                  setSelectedMpIndex(idx);
                  setSelectedCatIndex(0);
                }}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: selectedMpIndex === idx ? colors.primary[500] : inputBgColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: selectedMpIndex === idx ? colors.white : inputTextColor },
                  ]}
                >
                  {mp.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: labelColor, marginTop: spacing.md }]}>Kategori Merchant / Skema Fee</Text>
          {selectedMp.categories.map((cat, idx) => (
            <TouchableOpacity
              key={cat.name}
              onPress={() => setSelectedCatIndex(idx)}
              style={[
                styles.categoryButton,
                {
                  borderColor: selectedCatIndex === idx ? colors.primary[500] : colors.gray[300],
                  backgroundColor: selectedCatIndex === idx ? colors.primary[50] : 'transparent',
                },
              ]}
            >
              <Text style={{ color: selectedCatIndex === idx ? colors.primary[700] : inputTextColor, fontWeight: '600' }}>
                {cat.name}
              </Text>
              {selectedCatIndex === idx && <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Dynamic Inputs */}
        <Card padding="lg" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: inputTextColor }]}>Rincian Transaksi</Text>

          <Text style={[styles.label, { color: labelColor }]}>Harga Jual Produk (Rp)</Text>
          <TextInput
            placeholder="Masukkan harga jual"
            placeholderTextColor={colors.gray[400]}
            value={sellingPrice}
            onChangeText={setSellingPrice}
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
          />

          <Text style={[styles.label, { color: labelColor, marginTop: spacing.md }]}>Program Gratis Ongkir (%) - Opsional</Text>
          <TextInput
            placeholder="Contoh: 4 untuk 4%"
            placeholderTextColor={colors.gray[400]}
            value={freeShippingRate}
            onChangeText={setFreeShippingRate}
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
          />

          <Text style={[styles.label, { color: labelColor, marginTop: spacing.md }]}>Program Cashback (%) - Opsional</Text>
          <TextInput
            placeholder="Contoh: 2 untuk 2%"
            placeholderTextColor={colors.gray[400]}
            value={cashbackRate}
            onChangeText={setCashbackRate}
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: inputBgColor, color: inputTextColor }]}
          />
        </Card>

        {/* Calculation Summary */}
        <Card padding="xl" style={[styles.card, { backgroundColor: colors.primary[50] }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary[900] }]}>Estimasi Payout Bersih</Text>

          <View style={styles.summaryRow}>
            <Text style={{ color: colors.primary[800] }}>Harga Jual:</Text>
            <Text style={{ color: colors.primary[900], fontWeight: '700' }}>{formatCurrency(priceNum)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={{ color: colors.primary[800] }}>Total Biaya Admin ({ (totalFeePercent * 100).toFixed(1) }%):</Text>
            <Text style={{ color: colors.red[500], fontWeight: '700' }}>- {formatCurrency(adminFeeAmount)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={{ color: colors.primary[900], fontWeight: '800', fontSize: fontSize.md }}>Diterima Seller:</Text>
            <Text style={{ color: colors.green[600], fontWeight: '800', fontSize: fontSize.lg }}>{formatCurrency(netPayout)}</Text>
          </View>
        </Card>
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
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, marginHorizontal: 4 },
  tabButtonText: { fontWeight: '700', fontSize: fontSize.sm },
  label: { fontSize: fontSize.sm, fontWeight: '600', marginBottom: 4 },
  input: { padding: spacing.sm, borderRadius: 12, fontSize: fontSize.sm },
  categoryButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, borderWidth: 1, borderRadius: 12, marginVertical: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  divider: { height: 1, backgroundColor: 'rgba(14, 165, 233, 0.2)', marginVertical: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
});
