import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../shared/hooks/useTheme';
import { useRawMaterialStore } from '../../../application/stores/raw-material.store';
import { useProductStore } from '../../../application/stores/product.store';
import { useCalculationStore } from '../../../application/stores/calculation.store';

import { StatCard } from '../../components/shared/stat-card';
import { QuickAction } from '../../components/shared/quick-action';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Avatar } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { RootStackParamList } from '../../navigation/types';
import { spacing, fontSize, shadows } from '../../../shared/constants/spacing';
import { formatCurrency, formatNumber } from '../../../shared/utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const screenWidth = Dimensions.get('window').width;

export function DashboardScreen() {
  const nav = useNavigation<Nav>();
  const { colors, isDark, toggleMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const rawMaterials = useRawMaterialStore((s) => s.items);
  const fetchRawMaterials = useRawMaterialStore((s) => s.fetchAll);
  const products = useProductStore((s) => s.items);
  const fetchProducts = useProductStore((s) => s.fetchAll);
  const calculations = useCalculationStore((s) => s.calculations);
  const fetchCalculations = useCalculationStore((s) => s.fetchCalculations);

  const loadData = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchRawMaterials(),
      fetchProducts(),
      fetchCalculations(),
    ]);
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMaterialValue = rawMaterials.reduce(
    (sum, rm) => sum + rm.pricePerUnit * rm.stockQuantity,
    0
  );

  const chartData = {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [
      {
        data: [20000, 45000, 28000, 80000, 99000, 43000, 50000],
        color: (opacity = 1) => colors.primary[500],
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: isDark ? colors.gray[800] : colors.white,
    backgroundGradientFrom: isDark ? colors.gray[800] : colors.white,
    backgroundGradientTo: isDark ? colors.gray[800] : colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `${isDark ? colors.gray[300] : colors.gray[500]}`,
    labelColor: (opacity = 1) => `${isDark ? colors.gray[300] : colors.gray[500]}`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary[500],
    },
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
        <ScrollView contentContainerStyle={styles.loadingContent}>
          <Skeleton width={60} height={60} borderRadius={30} />
          <Skeleton width={180} height={24} style={{ marginTop: spacing.sm }} />
          <Skeleton width={120} height={16} style={{ marginTop: spacing.xs }} />
          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <Skeleton height={120} borderRadius={20} />
            </View>
            <View style={{ width: spacing.md }} />
            <View style={{ flex: 1 }}>
              <Skeleton height={120} borderRadius={20} />
            </View>
          </View>
          <Skeleton height={200} borderRadius={20} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        <LinearGradient
          colors={isDark ? [colors.gray[800], colors.gray[900]] : [colors.white, colors.gray[50]]}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View style={styles.greetingContainer}>
              <Avatar name="UMKM" size="lg" />
              <View style={styles.greetingText}>
                <Text style={[styles.greeting, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
                  Selamat Datang!
                </Text>
                <Text style={[styles.subGreeting, { color: isDark ? colors.white : colors.gray[900] }]}>
                  UMKM Profit Calculator
                </Text>
              </View>
            </View>
            <Button
              variant="ghost"
              size="md"
              icon={isDark ? 'sunny' : 'moon'}
              onPress={toggleMode}
            />
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          <StatCard
            title="Total Bahan"
            value={formatNumber(rawMaterials.length)}
            subtitle="Bahan baku terdaftar"
            icon="cube-outline"
            trend="up"
            trendValue="+12%"
          />
          <View style={styles.spacer} />
          <StatCard
            title="Total Produk"
            value={formatNumber(products.length)}
            subtitle="Produk tersedia"
            icon="cube"
            trend="neutral"
            trendValue="0%"
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Nilai Stok"
            value={formatCurrency(totalMaterialValue)}
            subtitle="Total stok bahan"
            icon="wallet-outline"
            gradient
          />
          <View style={styles.spacer} />
          <StatCard
            title="Perhitungan"
            value={formatNumber(calculations.length)}
            subtitle="Riwayat perhitungan"
            icon="calculator-outline"
            trend="up"
            trendValue="+5"
          />
        </View>

        <Card padding="xl" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.chartTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
                Pendapatan Mingguan
              </Text>
              <Text style={[styles.chartSubtitle, { color: isDark ? colors.gray[400] : colors.gray[500] }]}>
                7 hari terakhir
              </Text>
            </View>
            <Badge variant="success" label="+18%" />
          </View>
          <LineChart
            data={chartData}
            width={screenWidth - spacing.xl * 2}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
              Aksi Cepat
            </Text>
          </View>
          <View style={styles.quickActionsRow}>
            <QuickAction
              title="Tambah Bahan"
              icon="add-circle"
              onPress={() => nav.navigate('RawMaterialForm', {})}
              color={colors.primary[500]}
            />
            <View style={styles.spacer} />
            <QuickAction
              title="Tambah Produk"
              icon="add-circle-outline"
              onPress={() => nav.navigate('ProductForm', {})}
              color={colors.secondary[500]}
            />
            <View style={styles.spacer} />
            <QuickAction
              title="Hitung HPP"
              icon="calculator"
              onPress={() => nav.navigate('HppCalculator')}
              color={colors.accent[500]}
            />
            <View style={styles.spacer} />
            <QuickAction
              title="Simulasi"
              icon="analytics-outline"
              onPress={() => nav.navigate('MarginSimulation')}
              color={colors.green[500]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
              Produk Terbaru
            </Text>
            <Button
              variant="ghost"
              size="sm"
              title="Lihat Semua"
              onPress={() => nav.navigate('MainTabs', { screen: 'Products' })}
            />
          </View>
          {products.slice(0, 3).map((product, index) => (
            <Card key={product.id} padding="lg" style={styles.productCard}>
              <View style={styles.productRow}>
                <View style={styles.productIcon}>
                  <Ionicons name="cube" size={24} color={colors.primary[500]} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: isDark ? colors.white : colors.gray[900] }]}>
                    {product.name}
                  </Text>
                  <Text style={[styles.productPrice, { color: isDark ? colors.gray[400] : colors.gray[500] }]}>
                    {formatCurrency(product.sellingPrice)}
                  </Text>
                </View>
                <Badge
                  variant={product.isActive ? 'success' : 'outline'}
                  label={product.isActive ? 'Aktif' : 'Nonaktif'}
                />
              </View>
            </Card>
          ))}
          {products.length === 0 && (
            <Card padding="xl" style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: isDark ? colors.gray[400] : colors.gray[500] }]}>
                Belum ada produk
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  loadingContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
    borderRadius: 24,
    padding: spacing.lg,
    ...shadows.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    marginLeft: spacing.md,
  },
  greeting: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  subGreeting: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    lineHeight: 28,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  spacer: {
    width: spacing.md,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  quickActionsRow: {
    flexDirection: 'row',
  },
  chartCard: {
    marginTop: spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chartTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  chartSubtitle: {
    fontSize: fontSize.sm,
  },
  chart: {
    borderRadius: 16,
  },
  productCard: {
    marginBottom: spacing.sm,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  emptyCard: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
  },
});
