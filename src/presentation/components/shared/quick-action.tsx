import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { borderRadius, spacing, fontSize, shadows } from '../../../shared/constants/spacing';

interface QuickActionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
}

export function QuickAction({
  title,
  icon,
  onPress,
  color,
  style,
}: QuickActionProps) {
  const { colors, isDark } = useTheme();

  const bgColor = color || colors.primary[500];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.gray[700] : colors.white,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${bgColor}15` }]}>
        <Ionicons name={icon} size={24} color={bgColor} />
      </View>
      <Text
        style={[
          styles.title,
          { color: isDark ? colors.gray[200] : colors.gray[800] },
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});
