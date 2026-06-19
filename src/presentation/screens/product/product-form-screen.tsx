import { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProductStore } from '../../../application/stores/product.store';
import { RootStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAppForm } from '../../hooks/use-form';
import {
  CreateProductDTO,
  createProductSchema,
} from '../../../application/dtos/product.dto';
import { colors } from '../../../shared/constants/colors';
import { spacing } from '../../../shared/constants/spacing';

type Route = RouteProp<RootStackParamList, 'ProductForm'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProductFormScreen() {
  const route = useRoute<Route>();
  const nav = useNavigation<Nav>();
  const editId = route.params?.id;
  const create = useProductStore((s) => s.create);
  const update = useProductStore((s) => s.update);
  const selectedItem = useProductStore((s) => s.selectedItem);
  const fetchById = useProductStore((s) => s.fetchById);

  const form = useAppForm<CreateProductDTO>({
    schema: createProductSchema,
    defaultValues: {
      name: '',
      description: null,
      category: null,
      sellingPrice: null,
      imageUri: null,
    },
    onSubmit: async (data) => {
      if (editId) {
        await update(editId, data);
        nav.goBack();
      } else {
        const product = await create(data);
        if (product) {
          nav.replace('RecipeForm', {
            productId: product.id,
            productName: product.name,
          });
        }
      }
    },
  });

  useEffect(() => {
    if (editId) fetchById(editId);
  }, [editId]);

  useEffect(() => {
    if (editId && selectedItem) {
      form.reset({
        name: selectedItem.name,
        description: selectedItem.description,
        category: selectedItem.category,
        sellingPrice: selectedItem.sellingPrice,
        imageUri: selectedItem.imageUri,
      });
    }
  }, [editId, selectedItem]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Input
          label="Nama Produk"
          placeholder="Contoh: Kue Nastar"
          onChangeText={(v) => form.setValue('name', v)}
          value={form.watch('name')}
          error={form.errors.name?.message}
        />

        <Input
          label="Kategori (opsional)"
          placeholder="Contoh: Makanan"
          onChangeText={(v) => form.setValue('category', v || null)}
          value={form.watch('category') ?? ''}
        />

        <Input
          label="Harga Jual (opsional)"
          placeholder="0"
          keyboardType="numeric"
          onChangeText={(v) =>
            form.setValue('sellingPrice', v ? Number(v) : null)
          }
          value={form.watch('sellingPrice') ? String(form.watch('sellingPrice')) : ''}
        />

        <Input
          label="Deskripsi (opsional)"
          placeholder="Deskripsi produk..."
          multiline
          numberOfLines={3}
          onChangeText={(v) => form.setValue('description', v || null)}
          value={form.watch('description') ?? ''}
        />

        <View style={styles.submit}>
          <Button
            title={editId ? 'Simpan Perubahan' : 'Simpan & Lanjut ke Resep'}
            onPress={form.handleSubmit}
            loading={form.isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1 },
  content: { padding: spacing.lg },
  submit: { marginTop: spacing.lg },
});
