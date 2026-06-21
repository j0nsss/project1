import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { borderRadius } from '../../../shared/constants/spacing';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius: borderRadiusVal = borderRadius.sm,
  style,
}: SkeletonProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: borderRadiusVal,
          backgroundColor: isDark ? colors.gray[700] : colors.gray[200],
          opacity: 0.5,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {},
});
