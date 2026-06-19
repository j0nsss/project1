import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { colors } from '../../../shared/constants/colors';
import { borderRadius, spacing } from '../../../shared/constants/spacing';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = {
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
};

const variantStyles: Record<string, ViewStyle> = {
  elevated: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filled: {
    backgroundColor: colors.gray[50],
  },
};

export function Card({
  variant = 'elevated',
  padding = 'md',
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        { padding: paddingMap[padding] },
        variantStyles[variant],
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
  },
});
