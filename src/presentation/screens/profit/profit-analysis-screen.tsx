import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculationStore } from '../../../application/stores/calculation.store';
import { useProductStore } from '../../../application/stores/product.store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Loading } from '../../components/ui/loading';
import { EmptyState } from '../../components/ui/empty-state';
import { colors } from '../../../shared/constants/colors';
import { fontSize, spacing } from '../../../shared/constants/spacing';
import { formatCurrency, formatPercent } from '../../../shared/utils/format';
import { calculateProfitAnalysisUseCase } from '../../../application/use-cases/profit/analyze-profit.usecase';
import { ProfitAnalysisDTO } from '../../../application/dtos/calculation.dto';

export function ProfitAnalysisScreen() {
  const products = useProductStore((s) => s.items);
  const fetchProducts = useProductStore((s) => s.fetchAll);
  const analyzeProfit = useCalculationStore((s) => s.analyzeProfit);
  const isLoading = useCalculationStore((s) => s.isLoading);
  const profitAnalyses = useCalculationStore((s) => s.profitAnalyses);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [totalHpp, setTotalHpp] = useState('');
  const [operationalCost, setOperationalCost] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const getPreview = () => {
    if (!totalRevenue || !totalHpp) return null;
    return calculateProfitAnalysisUseCase({
      productId: selectedProductId,
      periodStart,
      periodEnd,
      totalRevenue: Number(totalRevenue) || 0,
      totalHpp: Number(totalHpp) || 0,
      operationalCost: Number(operationalCost) || 0,
      notes: null,
    });
  };

  const preview = getPreview();

  const handleAnalyze = async () => {
    await analyzeProfit({
      productId: selectedProductId,
      periodStart,
      periodEnd,
      totalRevenue: Number(totalRevenue) || 0,
      totalHpp: Number(totalHpp) || 0,
      operationalCost: Number(operationalCost) || 0,
      notes: null,
    } as ProfitAnalysisDTO);
  };

  if (isLoading) return <Loading fullScreen message="Menganalisis..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Analisis Keuntungan</Text>

        <Text style={styles.label}>Pilih Produk</Text>
        <View style={styles.productList}>
          {products.map((p) => (
            <Button
              key={p.id}
              variant={selectedProductId === p.id ? 'primary' : 'outline'}
              size="sm"
              title={p.name}
              onPress={() => setSelectedProductId(p.id)}
              style={styles.productBtn}
            />
          ))}
        </View>

        <Input
          label="Periode Awal (YYYY-MM-DD)"
          placeholder="2024-01-01"
          value={periodStart}
          onChangeText={setPeriodStart}
        />

        <Input
          label="Periode Akhir (YYYY-MM-DD)"
          placeholder="2024-12-31"
          value={periodEnd}
          onChangeText={setPeriodEnd}
        />

        <Input
          label="Total Pendapatan (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={totalRevenue}
          onChangeText={setTotalRevenue}
        />

        <Input
          label="Total HPP (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={totalHpp}
          onChangeText={setTotalHpp}
        />

        <Input
          label="Biaya Operasional (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={operationalCost}
          onChangeText={setOperationalCost}
        />

        {preview && (
          <Card variant="elevated" padding="lg" style={styles.previewCard}>
            <Text style={styles.previewTitle}>Preview Analisis</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Laba Kotor</Text>
              <Text style={styles.rowValueGreen}>
                {formatCurrency(preview.grossProfit)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Laba Bersih</Text>
              <Text style={styles.rowValueGreen}>
                {formatCurrency(preview.netProfit)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Margin</Text>
              <Text style={styles.rowValue}>
                {formatPercent(preview.marginPercent)}
              </Text>
            </View>
          </Card>
        )}

        <Button
          title="Simpan Analisis"
          onPress={handleAnalyze}
          loading={isLoading}
        />

        {profitAnalyses.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Riwayat Analisis</Text>
            {profitAnalyses.map((a) => (
              <Card key={a.id} variant="outlined" padding="sm" style={styles.historyCard}>
                <Text style={styles.historyDate}>
                  {a.periodStart} - {a.periodEnd}
                </Text>
                <Text style={styles.historyProfit}>
                  Laba: {formatCurrency(a.netProfit)} ({formatPercent(a.marginPercent)})
                </Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1 },
  content: { padding: spacing.lg },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.gray[900], marginBottom: spacing.md },
  label: { fontSize: fontSize.sm, fontWeight: '500', color: colors.gray[700], marginBottom: spacing.xs },
  productList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  productBtn: { marginBottom: spacing.xs },
  previewCard: { marginBottom: spacing.lg },
  previewTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.gray[900], marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  rowLabel: { fontSize: fontSize.sm, color: colors.gray[500] },
  rowValue: { fontSize: fontSize.md, fontWeight: '600', color: colors.gray[900] },
  rowValueGreen: { fontSize: fontSize.md, fontWeight: '600', color: colors.green[600] },
  historySection: { marginTop: spacing.xl },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.gray[900], marginBottom: spacing.md },
  historyCard: { marginBottom: spacing.sm },
  historyDate: { fontSize: fontSize.sm, color: colors.gray[500] },
  historyProfit: { fontSize: fontSize.md, fontWeight: '600', color: colors.gray[900], marginTop: 2 },
});
