import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useUIStore } from '../../../application/stores/ui.store';
import { colors } from '../../../shared/constants/colors';
import { borderRadius, fontSize, spacing } from '../../../shared/constants/spacing';

const typeStyles = {
  success: { bg: colors.green[500], icon: '✓' },
  error: { bg: colors.red[500], icon: '✕' },
  warning: { bg: colors.yellow[500], icon: '!' },
  info: { bg: colors.primary[600], icon: 'i' },
};

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          type={toast.type}
          message={toast.message}
        />
      ))}
    </View>
  );
}

function ToastItem({
  type,
  message,
}: {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const tStyle = typeStyles[type];

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: tStyle.bg, opacity },
      ]}
    >
      <Text style={styles.icon}>{tStyle.icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  icon: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSize.md,
    marginRight: spacing.sm,
  },
  message: {
    color: colors.white,
    fontSize: fontSize.sm,
    flex: 1,
  },
});
