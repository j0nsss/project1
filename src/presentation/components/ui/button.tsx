import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../../shared/constants/colors';
import { borderRadius, spacing, fontSize } from '../../../shared/constants/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary[600], text: colors.white },
  secondary: { bg: colors.primary[100], text: colors.primary[700] },
  outline: { bg: 'transparent', text: colors.primary[600], border: colors.primary[600] },
  ghost: { bg: 'transparent', text: colors.gray[600] },
};

const sizeStyles: Record<ButtonSize, { px: number; py: number; fs: number }> = {
  sm: { px: spacing.md, py: spacing.sm, fs: fontSize.sm },
  md: { px: spacing.lg, py: spacing.md, fs: fontSize.md },
  lg: { px: spacing.xl, py: spacing.md, fs: fontSize.lg },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  title,
  onPress,
  style,
}: ButtonProps) {
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: vStyle.bg,
          paddingHorizontal: sStyle.px,
          paddingVertical: sStyle.py,
          borderWidth: vStyle.border ? 1 : 0,
          borderColor: vStyle.border,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={vStyle.text}
          size={sStyle.fs === fontSize.sm ? 'small' : 'small'}
        />
      ) : (
        <Text
          style={
            {
              color: vStyle.text,
              fontSize: sStyle.fs,
              fontWeight: '600',
            } as TextStyle
          }
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
