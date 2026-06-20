import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { fontSize, spacing, borderRadius } from '../../../shared/constants/spacing';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ label, variant = 'default', size = 'md', style, textStyle }: BadgeProps) {
  const { colors, isDark } = useTheme();

  const variantStyles = {
    default: {
      container: {
        backgroundColor: isDark ? colors.gray[700] : colors.gray[100],
      },
      text: {
        color: isDark ? colors.gray[200] : colors.gray[700],
      },
    },
    primary: {
      container: {
        backgroundColor: colors.primary[100],
      },
      text: {
        color: colors.primary[700],
      },
    },
    success: {
      container: {
        backgroundColor: colors.green[100],
      },
      text: {
        color: colors.green[700],
      },
    },
    warning: {
      container: {
        backgroundColor: colors.yellow[100],
      },
      text: {
        color: colors.yellow[700],
      },
    },
    error: {
      container: {
        backgroundColor: colors.red[100],
      },
      text: {
        color: colors.red[700],
      },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDark ? colors.gray[500] : colors.gray[300],
      },
      text: {
        color: isDark ? colors.gray[200] : colors.gray[700],
      },
    },
  };

  const sizeStyles = {
    sm: {
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
      fontSize: fontSize.xxs,
    },
    md: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      fontSize: fontSize.xs,
    },
    lg: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: fontSize.sm,
    },
  };

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <View style={[styles.base, variantStyle.container, sizeStyle, style]}>
      <Text style={[styles.text, variantStyle.text, { fontSize: sizeStyle.fontSize }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
