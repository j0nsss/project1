import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../shared/hooks/useTheme';
import { borderRadius, spacing, fontSize, shadows } from '../../../shared/constants/spacing';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'success' | 'warning' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
}

export function GradientButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: GradientButtonProps) {
  const { colors, isDark } = useTheme();

  const gradientColors: Record<ButtonVariant, readonly [string, string]> = {
    primary: colors.gradients.primary,
    success: colors.gradients.success,
    warning: colors.gradients.warning,
    dark: colors.gradients.dark,
  };

  const sizeStyles: Record<ButtonSize, { px: number; py: number; fs: number }> = {
    sm: { px: spacing.md, py: spacing.sm, fs: fontSize.sm },
    md: { px: spacing.xl, py: spacing.md, fs: fontSize.md },
    lg: { px: spacing['2xl'], py: spacing.lg, fs: fontSize.lg },
    xl: { px: spacing['3xl'], py: spacing.xl, fs: fontSize.xl },
  };

  const sStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[style]}
    >
      <LinearGradient
        colors={gradientColors[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.base,
          {
            paddingHorizontal: sStyle.px,
            paddingVertical: sStyle.py,
            opacity: isDisabled ? 0.5 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sStyle.fs}
                color={colors.white}
                style={{ marginRight: spacing.sm }}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  fontSize: sStyle.fs,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={sStyle.fs}
                color={colors.white}
                style={{ marginLeft: spacing.sm }}
              />
            )}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  text: {
    color: 'white',
    fontWeight: '700',
  },
});
