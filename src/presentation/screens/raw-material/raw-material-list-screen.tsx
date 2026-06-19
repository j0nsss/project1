import { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../shared/constants/colors';
import { fontSize, spacing } from '../../../shared/constants/spacing';
import { useRawMaterialStore } from '../../../application/stores/raw-material.store';
import { RawMaterial } from '../../../domain/entities/raw-material.entity';
import { RootStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loading } from '../../components/ui/loading';
import { EmptyState } from '../../components/ui/empty-state';
import { formatCurrency } from '../../../shared/utils/format';
import { UNIT_LABELS } from '../../../shared/constants/units';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function RawMaterialListScreen() {
  const nav = useNavigation<Nav>();
  const items = useRawMaterialStore((s) => s.items);
  const isLoading = useRawMaterialStore((s) => s.isLoading);
  const error = useRawMaterialStore((s) => s.error);
  const fetchAll = useRawMaterialStore((s) => s.fetchAll);
  const removeItem = useRawMaterialStore((s) => s.remove);

  useEffect(() => {
    fetchAll();
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

  const renderItem = ({ item }: { item: RawMaterial }) => (
    <Card variant="outlined" padding="md" style={styles.card}>
      <TouchableOpacity
        onPress={() => nav.navigate('RawMaterialForm', { id: item.id })}
      >
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetail}>
          {UNIT_LABELS[item.unit] ?? item.unit} - {formatCurrency(item.pricePerUnit)}
        </Text>
        <Text style={styles.itemStock}>Stok: {item.stockQuantity}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item)}>
        <Text style={styles.deleteBtn}>Hapus</Text>
      </TouchableOpacity>
    </Card>
  );

  if (isLoading) return <Loading fullScreen message="Memuat bahan baku..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bahan Baku</Text>
          <Button
            title="+ Tambah"
            size="sm"
            onPress={() => nav.navigate('RawMaterialForm', {})}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="Belum ada bahan baku"
              message="Tambahkan bahan baku pertama Anda"
              action={
                <Button
                  title="Tambah Bahan Baku"
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
  safe: { flex: 1, backgroundColor: colors.gray[50] },
  container: { flex: 1, padding: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.gray[900] },
  list: { paddingBottom: spacing.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemName: { fontSize: fontSize.md, fontWeight: '600', color: colors.gray[900] },
  itemDetail: { fontSize: fontSize.sm, color: colors.gray[500], marginTop: 2 },
  itemStock: { fontSize: fontSize.xs, color: colors.gray[400], marginTop: 2 },
  deleteBtn: { color: colors.red[500], fontSize: fontSize.sm, marginLeft: spacing.md },
  error: { color: colors.red[500], marginBottom: spacing.sm },
});
