import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useCalculationStore } from '../../../application/stores/calculation.store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Loading } from '../../components/ui/loading';
import { colors } from '../../../shared/constants/colors';
import { fontSize, spacing } from '../../../shared/constants/spacing';
import { formatCurrency } from '../../../shared/utils/format';

type Route = RouteProp<RootStackParamList, 'HppCalculator'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HppCalculatorScreen() {
  const route = useRoute<Route>();
  const nav = useNavigation<Nav>();
  const { productId, productName } = route.params;

  const calculateHpp = useCalculationStore((s) => s.calculateHpp);
  const loadMaterialCost = useCalculationStore((s) => s.loadMaterialCost);
  const selectedCalculation = useCalculationStore((s) => s.selectedCalculation);
  const isLoading = useCalculationStore((s) => s.isLoading);

  const [materialCost, setMaterialCost] = useState(0);
  const [isLoadingCost, setIsLoadingCost] = useState(true);
  const [overheadCost, setOverheadCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [otherCost, setOtherCost] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadMaterialCost(productId).then((cost) => {
      setMaterialCost(cost);
      setIsLoadingCost(false);
    });
  }, [productId]);

  const totalHpp =
    materialCost +
    (Number(overheadCost) || 0) +
    (Number(laborCost) || 0) +
    (Number(otherCost) || 0);
  const hppPerUnit = totalHpp / (Number(quantity) || 1);

  const handleCalculate = async () => {
    await calculateHpp(
      {
        productId,
        overheadCost: Number(overheadCost) || 0,
        laborCost: Number(laborCost) || 0,
        otherCost: Number(otherCost) || 0,
        quantityProduced: Number(quantity) || 1,
        notes: notes || null,
      },
      materialCost
    );
  };

  useEffect(() => {
    if (selectedCalculation) {
      nav.navigate('MarginSimulation', {
        calculationId: selectedCalculation.id,
        productId,
        productName,
        hppPerUnit: selectedCalculation.hppPerUnit,
      });
    }
  }, [selectedCalculation]);

  if (isLoadingCost) return <Loading fullScreen message="Memuat data bahan..." />;
  if (isLoading) return <Loading fullScreen message="Menghitung HPP..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Hitung HPP: {productName}</Text>

        <Card variant="filled" padding="md" style={styles.materialCostCard}>
          <Text style={styles.materialLabel}>Total Biaya Bahan Baku</Text>
          <Text style={styles.materialValue}>{formatCurrency(materialCost)}</Text>
        </Card>

        <Input
          label="Biaya Overhead (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={overheadCost}
          onChangeText={setOverheadCost}
        />

        <Input
          label="Biaya Tenaga Kerja (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={laborCost}
          onChangeText={setLaborCost}
        />

        <Input
          label="Biaya Lainnya (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={otherCost}
          onChangeText={setOtherCost}
        />

        <Input
          label="Jumlah Produksi"
          placeholder="1"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <Input
          label="Catatan (opsional)"
          placeholder="Catatan perhitungan..."
          value={notes}
          onChangeText={setNotes}
        />

        <Card variant="elevated" padding="md" style={styles.resultCard}>
          <Text style={styles.resultLabel}>Total HPP</Text>
          <Text style={styles.resultValue}>{formatCurrency(totalHpp)}</Text>
          <View style={styles.divider} />
          <Text style={styles.resultLabel}>HPP per Unit</Text>
          <Text style={styles.resultValue}>{formatCurrency(hppPerUnit)}</Text>
        </Card>

        <Button
          title="Simpan & Lanjut ke Simulasi Margin"
          onPress={handleCalculate}
          loading={isLoading}
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
  materialCostCard: { marginBottom: spacing.lg },
  materialLabel: { fontSize: fontSize.sm, color: colors.gray[500] },
  materialValue: { fontSize: fontSize['2xl'], fontWeight: '700', color: colors.primary[600] },
  resultCard: { marginBottom: spacing.lg },
  resultLabel: { fontSize: fontSize.sm, color: colors.gray[500] },
  resultValue: { fontSize: fontSize['2xl'], fontWeight: '700', color: colors.gray[900] },
  divider: { height: 1, backgroundColor: colors.gray[200], marginVertical: spacing.sm },
});
