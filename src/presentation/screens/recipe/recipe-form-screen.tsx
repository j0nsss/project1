import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRawMaterialStore } from '../../../application/stores/raw-material.store';
import { useRecipeStore } from '../../../application/stores/recipe.store';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { EmptyState } from '../../components/ui/empty-state';
import { colors } from '../../../shared/constants/colors';
import { fontSize, spacing } from '../../../shared/constants/spacing';
import { formatCurrency } from '../../../shared/utils/format';

type Route = RouteProp<RootStackParamList, 'RecipeForm'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

interface RecipeItem {
  rawMaterialId: string;
  rawMaterialName: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
}

export function RecipeFormScreen() {
  const route = useRoute<Route>();
  const nav = useNavigation<Nav>();
  const { productId, productName } = route.params;
  const rawMaterials = useRawMaterialStore((s) => s.items);
  const fetchRawMaterials = useRawMaterialStore((s) => s.fetchAll);
  const saveRecipe = useRecipeStore((s) => s.saveRecipe);

  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [quantity, setQuantity] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const remainingMaterials = rawMaterials.filter(
    (rm) => !recipeItems.some((ri) => ri.rawMaterialId === rm.id)
  );

  const addItem = () => {
    if (!selectedMaterialId || !quantity) return;
    const material = rawMaterials.find((rm) => rm.id === selectedMaterialId);
    if (!material) return;

    setRecipeItems((prev) => [
      ...prev,
      {
        rawMaterialId: material.id,
        rawMaterialName: material.name,
        unit: material.unit,
        quantity: Number(quantity),
        pricePerUnit: material.pricePerUnit,
      },
    ]);
    setSelectedMaterialId('');
    setQuantity('');
  };

  const removeItem = (index: number) => {
    setRecipeItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCost = recipeItems.reduce(
    (sum, item) => sum + item.quantity * item.pricePerUnit,
    0
  );

  const handleSave = async () => {
    if (recipeItems.length === 0) {
      Alert.alert('Resep Kosong', 'Tambahkan minimal 1 bahan baku');
      return;
    }
    setIsSaving(true);
    await saveRecipe(
      productId,
      recipeItems.map((item) => ({
        rawMaterialId: item.rawMaterialId,
        quantity: item.quantity,
        unit: item.unit,
      }))
    );
    setIsSaving(false);
    nav.navigate('HppCalculator', { productId, productName });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Resep: {productName}</Text>
        <Text style={styles.subtitle}>
          Pilih bahan baku dan tentukan jumlah yang dibutuhkan
        </Text>

        <Text style={styles.sectionLabel}>Pilih Bahan Baku</Text>
        <View style={styles.materialOptions}>
          {remainingMaterials.length === 0 && recipeItems.length > 0 ? (
            <Text style={styles.infoText}>Semua bahan sudah ditambahkan</Text>
          ) : (
            remainingMaterials.map((m) => (
              <Button
                key={m.id}
                variant={selectedMaterialId === m.id ? 'primary' : 'outline'}
                size="sm"
                title={`${m.name} (${formatCurrency(m.pricePerUnit)}/${m.unit})`}
                onPress={() => setSelectedMaterialId(m.id)}
                style={styles.materialBtn}
              />
            ))
          )}
        </View>

        <View style={styles.addRow}>
          <Input
            label="Jumlah"
            placeholder="0"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            containerStyle={styles.quantityInput}
          />
          <Button
            title="Tambah"
            size="md"
            onPress={addItem}
            disabled={!selectedMaterialId || !quantity}
          />
        </View>

        <FlatList
          data={recipeItems}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <Card variant="outlined" padding="sm" style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.rawMaterialName}</Text>
                <Text style={styles.itemDetail}>
                  {item.quantity} {item.unit} x {formatCurrency(item.pricePerUnit)}
                </Text>
                <Text style={styles.itemSubtotal}>
                  = {formatCurrency(item.quantity * item.pricePerUnit)}
                </Text>
              </View>
              <Button
                title="Hapus"
                size="sm"
                variant="ghost"
                onPress={() => removeItem(index)}
              />
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState
              title="Resep kosong"
              message="Pilih bahan baku dan tambahkan jumlahnya"
            />
          }
        />

        <Card variant="filled" padding="md" style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Biaya Bahan</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalCost)}</Text>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Simpan & Lanjut ke HPP"
            onPress={handleSave}
            loading={isSaving}
            disabled={recipeItems.length === 0}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray[50] },
  container: { flex: 1, padding: spacing.lg },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.gray[900] },
  subtitle: { fontSize: fontSize.sm, color: colors.gray[500], marginBottom: spacing.md, marginTop: spacing.xs },
  sectionLabel: { fontSize: fontSize.sm, fontWeight: '500', color: colors.gray[700], marginBottom: spacing.sm },
  materialOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  materialBtn: { marginBottom: spacing.xs },
  infoText: { fontSize: fontSize.sm, color: colors.gray[400], fontStyle: 'italic' },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, marginBottom: spacing.md },
  quantityInput: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  itemInfo: { flex: 1 },
  itemName: { fontSize: fontSize.md, fontWeight: '600', color: colors.gray[900] },
  itemDetail: { fontSize: fontSize.sm, color: colors.gray[500] },
  itemSubtotal: { fontSize: fontSize.sm, fontWeight: '500', color: colors.primary[600] },
  totalCard: { marginTop: spacing.sm },
  totalLabel: { fontSize: fontSize.sm, color: colors.gray[500] },
  totalValue: { fontSize: fontSize['2xl'], fontWeight: '700', color: colors.primary[600] },
  actions: { marginTop: spacing.lg, marginBottom: spacing.xl },
});
