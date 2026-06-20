import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { borderRadius, spacing, fontSize } from '../../../shared/constants/spacing';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  size?: AvatarSize;
  source?: { uri: string };
  name?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  backgroundColor?: string;
  textColor?: string;
  style?: any;
}

export function Avatar({
  size = 'md',
  source,
  name,
  icon,
  backgroundColor,
  textColor,
  style,
}: AvatarProps) {
  const { colors, isDark } = useTheme();

  const sizeStyles: Record<AvatarSize, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 96,
  };

  const iconSizes: Record<AvatarSize, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
  };

  const fontSizeSizes: Record<AvatarSize, number> = {
    xs: fontSize.xxs,
    sm: fontSize.xs,
    md: fontSize.sm,
    lg: fontSize.md,
    xl: fontSize.xl,
    '2xl': fontSize['3xl'],
  };

  const dimension = sizeStyles[size];
  const iconSize = iconSizes[size];
  const fontSizeVal = fontSizeSizes[size];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const bgColor = backgroundColor || colors.primary[500];
  const txtColor = textColor || colors.white;

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: source ? 'transparent' : bgColor,
        },
        style,
      ]}
    >
      {source ? (
        <Image source={source} style={styles.image} resizeMode="cover" />
      ) : name ? (
        <Text style={[styles.text, { fontSize: fontSizeVal, color: txtColor }]}>
          {getInitials(name)}
        </Text>
      ) : icon ? (
        <Ionicons name={icon} size={iconSize} color={txtColor} />
      ) : (
        <Ionicons name="person" size={iconSize} color={txtColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontWeight: '600',
  },
});
