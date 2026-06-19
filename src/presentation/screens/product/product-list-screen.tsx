import { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../shared/constants/colors';
import { fontSize, spacing } from '../../../shared/constants/spacing';
import { useProductStore } from '../../../application/stores/product.store';
import { Product } from '../../../domain/entities/product.entity';
import { RootStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui/button';
import { Loading } from '../../components/ui/loading';
import { EmptyState } from '../../components/ui/empty-state';
import { ProductCard } from '../../components/shared/product-card';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProductListScreen() {
  const nav = useNavigation<Nav>();
  const items = useProductStore((s) => s.items);
  const isLoading = useProductStore((s) => s.isLoading);
  const fetchAll = useProductStore((s) => s.fetchAll);
  const removeItem = useProductStore((s) => s.remove);

  useEffect(() => {
    fetchAll();
  }, []);

  const handlePress = useCallback((product: Product) => {
    nav.navigate('ProductForm', { id: product.id });
  }, []);

  const handleDelete = useCallback((product: Product) => {
    Alert.alert('Hapus Produk', `Yakin ingin menghapus "${product.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => removeItem(product.id) },
    ]);
  }, []);

  if (isLoading) return <Loading fullScreen message="Memuat produk..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Produk</Text>
          <Button
            title="+ Tambah"
            size="sm"
            onPress={() => nav.navigate('ProductForm', {})}
          />
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handlePress}
              rightAction={
                <Button
                  title="Hapus"
                  size="sm"
                  variant="ghost"
                  onPress={() => handleDelete(item)}
                />
              }
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="Belum ada produk"
              message="Tambahkan produk pertama Anda"
              action={
                <Button
                  title="Tambah Produk"
                  onPress={() => nav.navigate('ProductForm', {})}
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
});
