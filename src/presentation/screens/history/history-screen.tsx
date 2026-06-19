import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../shared/constants/colors';
import { fontSize, spacing } from '../../../shared/constants/spacing';
import { useCalculationStore } from '../../../application/stores/calculation.store';
import { useProductStore } from '../../../application/stores/product.store';
import { RootStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loading } from '../../components/ui/loading';
import { EmptyState } from '../../components/ui/empty-state';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';
import { Calculation } from '../../../domain/entities/calculation.entity';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HistoryScreen() {
  const nav = useNavigation<Nav>();
  const calculations = useCalculationStore((s) => s.calculations);
  const fetchCalculations = useCalculationStore((s) => s.fetchCalculations);
  const isLoading = useCalculationStore((s) => s.isLoading);
  const products = useProductStore((s) => s.items);
  const fetchProducts = useProductStore((s) => s.fetchAll);

  useEffect(() => {
    fetchCalculations();
    fetchProducts();
  }, []);

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name ?? 'Produk tidak dikenal';
  };

  const renderItem = ({ item }: { item: Calculation }) => (
    <Card variant="outlined" padding="md" style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{getProductName(item.productId)}</Text>
        <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <Text style={styles.label}>Total HPP</Text>
          <Text style={styles.value}>{formatCurrency(item.totalHpp)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>HPP per Unit</Text>
          <Text style={styles.value}>{formatCurrency(item.hppPerUnit)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Jumlah Produksi</Text>
          <Text style={styles.value}>{item.quantityProduced}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <Button
          title="Simulasi Margin"
          size="sm"
          variant="outline"
          onPress={() =>
            nav.navigate('MarginSimulation', {
              calculationId: item.id,
              productId: item.productId,
              productName: getProductName(item.productId),
              hppPerUnit: item.hppPerUnit,
            })
          }
        />
      </View>
    </Card>
  );

  if (isLoading) return <Loading fullScreen message="Memuat riwayat..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Riwayat Perhitungan</Text>

        <FlatList
          data={calculations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="Belum ada perhitungan"
              message="Hitung HPP produk untuk melihat riwayat"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray[50] },
  container: { flex: 1, padding: spacing.lg },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.gray[900], marginBottom: spacing.md },
  list: { paddingBottom: spacing.xl },
  card: { marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  productName: { fontSize: fontSize.md, fontWeight: '600', color: colors.gray[900] },
  date: { fontSize: fontSize.xs, color: colors.gray[400] },
  cardBody: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  label: { fontSize: fontSize.sm, color: colors.gray[500] },
  value: { fontSize: fontSize.sm, fontWeight: '600', color: colors.gray[900] },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end' },
});
