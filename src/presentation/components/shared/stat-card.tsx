import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../ui/card';
import { useTheme } from '../../../shared/hooks/useTheme';
import { fontSize, spacing, shadows } from '../../../shared/constants/spacing';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  gradient?: boolean;
  style?: any;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  gradient = false,
  style,
}: StatCardProps) {
  const { colors, isDark } = useTheme();

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors.green[500];
      case 'down':
        return colors.red[500];
      default:
        return colors.gray[500];
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  if (gradient) {
    return (
      <LinearGradient
        colors={colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientCard, style]}
      >
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={28} color={colors.white} />
          </View>
        )}
        <Text style={styles.titleLight}>{title}</Text>
        <Text style={styles.valueLight}>{value}</Text>
        {subtitle && <Text style={styles.subtitleLight}>{subtitle}</Text>}
        {trend && trendValue && (
          <View style={styles.trendContainer}>
            <Ionicons name={getTrendIcon()} size={16} color={colors.white} />
            <Text style={styles.trendTextLight}>{trendValue}</Text>
          </View>
        )}
      </LinearGradient>
    );
  }

  return (
    <Card variant="elevated" padding="lg" style={[styles.card, style]}>
      <View style={styles.headerRow}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: colors.primary[100] }]}>
            <Ionicons name={icon} size={24} color={colors.primary[500]} />
          </View>
        )}
        {trend && trendValue && (
          <View style={styles.trendContainer}>
            <Ionicons name={getTrendIcon()} size={16} color={getTrendColor()} />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>{trendValue}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.title, { color: isDark ? colors.gray[400] : colors.gray[500] }]}>
        {title}
      </Text>
      <Text style={[styles.value, { color: isDark ? colors.white : colors.gray[900] }]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: isDark ? colors.gray[400] : colors.gray[400] }]}>
          {subtitle}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  gradientCard: {
    flex: 1,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  titleLight: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fontSize['3xl'],
    fontWeight: '800',
    lineHeight: 36,
  },
  valueLight: {
    fontSize: fontSize['3xl'],
    fontWeight: '800',
    color: 'white',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  subtitleLight: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  trendTextLight: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: 'white',
  },
});
