import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../shared/constants/colors';
import { fontSize, spacing } from '../../../shared/constants/spacing';
import { StatCard } from '../../components/shared/stat-card';
import { useRawMaterialStore } from '../../../application/stores/raw-material.store';
import { useProductStore } from '../../../application/stores/product.store';
import { useCalculationStore } from '../../../application/stores/calculation.store';
import { Loading } from '../../components/ui/loading';
import { formatCurrency, formatNumber } from '../../../shared/utils/format';

export function DashboardScreen() {
  const rawMaterials = useRawMaterialStore((s) => s.items);
  const fetchRawMaterials = useRawMaterialStore((s) => s.fetchAll);
  const rmLoading = useRawMaterialStore((s) => s.isLoading);
  const products = useProductStore((s) => s.items);
  const fetchProducts = useProductStore((s) => s.fetchAll);
  const prLoading = useProductStore((s) => s.isLoading);
  const calculations = useCalculationStore((s) => s.calculations);
  const fetchCalculations = useCalculationStore((s) => s.fetchCalculations);
  const isLoading = rmLoading || prLoading;

  useEffect(() => {
    fetchRawMaterials();
    fetchProducts();
    fetchCalculations();
  }, []);

  const totalMaterialValue = rawMaterials.reduce(
    (sum, rm) => sum + rm.pricePerUnit * rm.stockQuantity,
    0
  );

  if (isLoading) return <Loading fullScreen message="Memuat data..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Dashboard</Text>
        <Text style={styles.subtitle}>Ringkasan bisnis UMKM Anda</Text>

        <View style={styles.statsRow}>
          <StatCard
            title="Total Bahan Baku"
            value={formatNumber(rawMaterials.length)}
            subtitle="Jenis bahan baku"
          />
          <View style={styles.spacer} />
          <StatCard
            title="Total Produk"
            value={formatNumber(products.length)}
            subtitle="Produk terdaftar"
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Nilai Stok"
            value={formatCurrency(totalMaterialValue)}
            subtitle="Total nilai bahan baku"
          />
          <View style={styles.spacer} />
          <StatCard
            title="Perhitungan"
            value={formatNumber(calculations.length)}
            subtitle="Riwayat HPP"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  spacer: {
    width: spacing.md,
  },
});
