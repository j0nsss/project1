import { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useRawMaterialStore } from '../../../application/stores/raw-material.store';
import { RootStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAppForm } from '../../hooks/use-form';
import {
  CreateRawMaterialDTO,
  createRawMaterialSchema,
} from '../../../application/dtos/raw-material.dto';
import { colors } from '../../../shared/constants/colors';
import { spacing } from '../../../shared/constants/spacing';
import { UNIT_OPTIONS } from '../../../shared/constants/units';

type Route = RouteProp<RootStackParamList, 'RawMaterialForm'>;

export function RawMaterialFormScreen() {
  const route = useRoute<Route>();
  const editId = route.params?.id;
  const create = useRawMaterialStore((s) => s.create);
  const update = useRawMaterialStore((s) => s.update);
  const selectedItem = useRawMaterialStore((s) => s.selectedItem);
  const fetchById = useRawMaterialStore((s) => s.fetchById);

  const form = useAppForm<CreateRawMaterialDTO>({
    schema: createRawMaterialSchema,
    defaultValues: {
      name: '',
      unit: 'kg',
      pricePerUnit: 0,
      stockQuantity: 0,
      category: null,
      notes: null,
    },
    onSubmit: async (data) => {
      if (editId) {
        await update(editId, data);
      } else {
        await create(data);
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
        unit: selectedItem.unit,
        pricePerUnit: selectedItem.pricePerUnit,
        stockQuantity: selectedItem.stockQuantity,
        category: selectedItem.category,
        notes: selectedItem.notes,
      });
    }
  }, [editId, selectedItem]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Input
          label="Nama Bahan Baku"
          placeholder="Contoh: Tepung Terigu"
          onChangeText={(v) => form.setValue('name', v)}
          value={form.watch('name')}
          error={form.errors.name?.message}
        />

        <Input
          label="Harga per Satuan (Rp)"
          placeholder="0"
          keyboardType="numeric"
          onChangeText={(v) => form.setValue('pricePerUnit', Number(v) || 0)}
          value={String(form.watch('pricePerUnit') || '')}
          error={form.errors.pricePerUnit?.message}
        />

        <Input
          label="Stok"
          placeholder="0"
          keyboardType="numeric"
          onChangeText={(v) => form.setValue('stockQuantity', Number(v) || 0)}
          value={String(form.watch('stockQuantity') ?? '')}
          error={form.errors.stockQuantity?.message}
        />

        <Input
          label="Kategori (opsional)"
          placeholder="Contoh: Bahan Pokok"
          onChangeText={(v) => form.setValue('category', v || null)}
          value={form.watch('category') ?? ''}
        />

        <Input
          label="Catatan (opsional)"
          placeholder="Catatan tambahan..."
          multiline
          numberOfLines={3}
          onChangeText={(v) => form.setValue('notes', v || null)}
          value={form.watch('notes') ?? ''}
        />

        <View style={styles.submit}>
          <Button
            title={editId ? 'Simpan Perubahan' : 'Tambah Bahan Baku'}
            onPress={form.handleSubmit}
            loading={form.isSubmitting}
            disabled={!form.isValid}
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
