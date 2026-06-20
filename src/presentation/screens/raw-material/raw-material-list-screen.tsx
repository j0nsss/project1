import { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../../shared/hooks/useTheme';
import { useRawMaterialStore } from '../../../../application/stores/raw-material.store';
import { RawMaterial } from '../../../../domain/entities/raw-material.entity';
import { RootStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loading } from '../../components/ui/loading';
import { EmptyState } from '../../components/ui/empty-state';
import { Badge } from '../../components/ui/badge';
import { SearchBar } from '../../components/ui/search-bar';
import { formatCurrency } from '../../../../shared/utils/format';
import { UNIT_LABELS } from '../../../../shared/constants/units';
import { spacing, fontSize, shadows } from '../../../../shared/constants/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function RawMaterialListScreen() {
  const nav = useNavigation<Nav>();
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const items = useRawMaterialStore((s) => s.items);
  const isLoading = useRawMaterialStore((s) => s.isLoading);
  const error = useRawMaterialStore((s) => s.error);
  const fetchAll = useRawMaterialStore((s) => s.fetchAll);
  const removeItem = useRawMaterialStore((s) => s.remove);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAll();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, []);

  const handleDelete = useCallback((item: RawMaterial) => {
    Alert.alert(
      'Hapus Bahan Baku',
      `Yakin ingin menghapus "${item.name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => removeItem(item.id),
        },
      ]
    );
  }, []);

  const renderRightActions = (progress: any, dragX: any, item: RawMaterial) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const style = useAnimatedStyle(() => ({
      transform: [{ translateX: withTiming(trans.value) }],
    }));

    return (
      <Animated.View style={[styles.deleteActionContainer, style]}>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.red[500] }]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderItem = ({ item }: { item: RawMaterial }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
      overshootRight={false}
    >
      <Card variant="flat" padding="lg" style={styles.itemCard}>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => nav.navigate('RawMaterialForm', { id: item.id })}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBackground, { backgroundColor: `${colors.primary[500]}15` }]}>
            <Ionicons name="cube-outline" size={28} color={colors.primary[500]} />
          </View>
          <View style={styles.itemText}>
            <Text style={[styles.itemName, { color: isDark ? colors.white : colors.gray[900] }]}>
              {item.name}
            </Text>
            <Text style={[styles.itemDetail, { color: isDark ? colors.gray[400] : colors.gray[500] }]}>
              {UNIT_LABELS[item.unit] ?? item.unit} • {formatCurrency(item.pricePerUnit)}
            </Text>
            <View style={styles.itemMeta}>
              <Badge
                variant={item.stockQuantity > 0 ? 'success' : 'warning'}
                label={`Stok: ${item.stockQuantity}`}
              />
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? colors.gray[500] : colors.gray[400]}
          />
        </TouchableOpacity>
      </Card>
    </Swipeable>
  );

  if (isLoading && items.length === 0) {
    return <Loading fullScreen message="Memuat bahan baku..." />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: isDark ? colors.white : colors.gray[900] }]}>
              Bahan Baku
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? colors.gray[400] : colors.gray[500] }]}>
              Kelola semua bahan baku Anda
            </Text>
          </View>
          <Button
            title="Tambah"
            size="md"
            icon="add"
            onPress={() => nav.navigate('RawMaterialForm', {})}
          />
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Cari bahan baku..."
        />

        {error && <Text style={[styles.error, { color: colors.red[500] }]}>{error}</Text>}

        <FlashList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyState
              title="Belum ada bahan baku"
              message="Tambahkan bahan baku pertama Anda"
              action={
                <Button
                  title="Tambah Bahan Baku"
                  icon="add"
                  onPress={() => nav.navigate('RawMaterialForm', {})}
                />
              }
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  list: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  itemCard: {
    marginBottom: spacing.sm,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    lineHeight: 24,
  },
  itemDetail: {
    fontSize: fontSize.sm,
    marginTop: spacing.xxs,
  },
  itemMeta: {
    marginTop: spacing.sm,
  },
  deleteActionContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.md,
  },
  error: {
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
  },
});
