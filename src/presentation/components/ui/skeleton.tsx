import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
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
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.ease }),
        withTiming(0.3, { duration: 800, easing: Easing.ease })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: borderRadiusVal,
          backgroundColor: isDark ? colors.gray[700] : colors.gray[200],
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {},
});
