import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useCalculationStore } from '../../../application/stores/calculation.store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { colors } from '../../../shared/constants/colors';
import { fontSize, spacing } from '../../../shared/constants/spacing';
import { formatCurrency, formatPercent } from '../../../shared/utils/format';
import { simulateMarginUseCase } from '../../../application/use-cases/margin/simulate-margin.usecase';
import { MarginSimulationResult } from '../../../application/use-cases/margin/simulate-margin.usecase';

type Route = RouteProp<RootStackParamList, 'MarginSimulation'>;

export function MarginSimulationScreen() {
  const route = useRoute<Route>();
  const { calculationId, productId, productName, hppPerUnit } = route.params;
  const simulateMargin = useCalculationStore((s) => s.simulateMargin);

  const [marginPercent, setMarginPercent] = useState('30');
  const [quantitySold, setQuantitySold] = useState('100');
  const [result, setResult] = useState<MarginSimulationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const simulation = simulateMarginUseCase(hppPerUnit, {
        calculationId,
        productId,
        desiredMarginPercent: Number(marginPercent) || 0,
        quantitySold: Number(quantitySold) || 1,
      });
      setResult(simulation);
    } catch {
      setResult(null);
    }
  }, [marginPercent, quantitySold, hppPerUnit]);

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    await simulateMargin(
      {
        calculationId,
        productId,
        desiredMarginPercent: Number(marginPercent) || 0,
        quantitySold: Number(quantitySold) || 1,
      },
      hppPerUnit
    );
    setIsSaving(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Simulasi Margin: {productName}</Text>

        <Card variant="filled" padding="md" style={styles.hppCard}>
          <Text style={styles.hppLabel}>HPP per Unit</Text>
          <Text style={styles.hppValue}>{formatCurrency(hppPerUnit)}</Text>
        </Card>

        <Input
          label="Margin Keuntungan yang Diinginkan (%)"
          placeholder="30"
          keyboardType="numeric"
          value={marginPercent}
          onChangeText={setMarginPercent}
        />

        <Input
          label="Jumlah Terjual (estimasi)"
          placeholder="100"
          keyboardType="numeric"
          value={quantitySold}
          onChangeText={setQuantitySold}
        />

        {result && (
          <Card variant="elevated" padding="lg" style={styles.resultCard}>
            <Text style={styles.resultTitle}>Hasil Simulasi</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Harga Jual yang Disarankan</Text>
              <Text style={styles.resultValueHighlight}>
                {formatCurrency(result.suggestedPrice)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Margin</Text>
              <Text style={styles.resultValue}>
                {formatPercent(result.desiredMarginPercent)}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Laba per Unit</Text>
              <Text style={styles.resultValueGreen}>
                {formatCurrency(result.profitPerUnit)}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Laba (est.)</Text>
              <Text style={styles.resultValueGreen}>
                {formatCurrency(result.totalProfit)}
              </Text>
            </View>
          </Card>
        )}

        <Button
          title="Simpan Simulasi"
          onPress={handleSave}
          loading={isSaving}
          disabled={!result}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1 },
  content: { padding: spacing.lg },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.gray[900], marginBottom: spacing.md },
  hppCard: { marginBottom: spacing.lg },
  hppLabel: { fontSize: fontSize.sm, color: colors.gray[500] },
  hppValue: { fontSize: fontSize['2xl'], fontWeight: '700', color: colors.primary[600] },
  resultCard: { marginBottom: spacing.lg },
  resultTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.gray[900], marginBottom: spacing.md },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  resultLabel: { fontSize: fontSize.sm, color: colors.gray[500] },
  resultValue: { fontSize: fontSize.md, fontWeight: '600', color: colors.gray[900] },
  resultValueHighlight: { fontSize: fontSize.xl, fontWeight: '700', color: colors.primary[600] },
  resultValueGreen: { fontSize: fontSize.md, fontWeight: '600', color: colors.green[600] },
  divider: { height: 1, backgroundColor: colors.gray[200], marginVertical: spacing.sm },
});
