import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { borderRadius, spacing, shadows } from '../../../shared/constants/spacing';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled' | 'flat';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const paddingMap = {
  none: 0,
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
};

export function Card({
  variant = 'elevated',
  padding = 'md',
  style,
  children,
  ...rest
}: CardProps) {
  const { colors, isDark } = useTheme();

  const variantStyles: Record<string, ViewStyle> = {
    elevated: {
      backgroundColor: isDark ? colors.gray[700] : colors.white,
      ...shadows.md,
    },
    outlined: {
      backgroundColor: isDark ? colors.gray[800] : colors.white,
      borderWidth: 1,
      borderColor: isDark ? colors.gray[600] : colors.gray[200],
    },
    filled: {
      backgroundColor: isDark ? colors.gray[700] : colors.gray[100],
    },
    flat: {
      backgroundColor: isDark ? colors.gray[800] : colors.white,
    },
  };

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
    borderRadius: borderRadius.xl,
  },
});
