import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../ui/card';
import { colors } from '../../../shared/constants/colors';
import { fontSize, spacing } from '../../../shared/constants/spacing';
import { Product } from '../../../domain/entities/product.entity';
import { formatCurrency } from '../../../shared/utils/format';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  rightAction?: React.ReactNode;
}

export function ProductCard({ product, onPress, rightAction }: ProductCardProps) {
  return (
    <TouchableOpacity onPress={() => onPress(product)} activeOpacity={0.7}>
      <Card variant="outlined" padding="md" style={styles.card}>
        <View style={styles.content}>
          <View style={styles.info}>
            <Text style={styles.name}>{product.name}</Text>
            {product.category && (
              <Text style={styles.category}>{product.category}</Text>
            )}
            {product.sellingPrice != null && (
              <Text style={styles.price}>
                {formatCurrency(product.sellingPrice)}
              </Text>
            )}
          </View>
          {rightAction && <View style={styles.action}>{rightAction}</View>}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  category: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
  price: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.primary[600],
    marginTop: spacing.xs,
  },
  action: {
    marginLeft: spacing.sm,
  },
});
