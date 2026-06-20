import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { borderRadius, spacing, fontSize } from '../../../shared/constants/spacing';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
}

const sizeStyles: Record<ButtonSize, { px: number; py: number; fs: number; iconSize: number }> = {
  sm: { px: spacing.md, py: spacing.sm, fs: fontSize.sm, iconSize: 16 },
  md: { px: spacing.lg, py: spacing.md, fs: fontSize.md, iconSize: 18 },
  lg: { px: spacing.xl, py: spacing.lg, fs: fontSize.lg, iconSize: 20 },
  xl: { px: spacing['2xl'], py: spacing.xl, fs: fontSize.xl, iconSize: 24 },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  title,
  onPress,
  style,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const { colors, isDark } = useTheme();
  const sStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.primary[500],
          text: colors.white,
        };
      case 'secondary':
        return {
          bg: isDark ? colors.gray[700] : colors.gray[100],
          text: isDark ? colors.gray[200] : colors.gray[800],
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: colors.primary[500],
          border: colors.primary[500],
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: isDark ? colors.gray[300] : colors.gray[600],
        };
      case 'danger':
        return {
          bg: colors.red[500],
          text: colors.white,
        };
      default:
        return {
          bg: colors.primary[500],
          text: colors.white,
        };
    }
  };

  const vStyle = getVariantStyles();

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
          borderWidth: vStyle.border ? 1.5 : 0,
          borderColor: vStyle.border || 'transparent',
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={vStyle.text}
          size={sStyle.fs <= fontSize.sm ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={sStyle.iconSize}
              color={vStyle.text}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={
              {
                color: vStyle.text,
                fontSize: sStyle.fs,
                fontWeight: '700',
              } as TextStyle
            }
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={sStyle.iconSize}
              color={vStyle.text}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
