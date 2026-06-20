import { useThemeStore } from '../../application/stores/theme.store';
import { colors, darkColors } from '../constants/colors';

export function useTheme() {
  const mode = useThemeStore((state) => state.mode);
  const isDark = mode === 'dark';

  const themeColors = isDark ? darkColors : colors;

  return {
    isDark,
    colors: themeColors,
    mode,
    setMode: useThemeStore((state) => state.setMode),
    toggleMode: useThemeStore((state) => state.toggleMode),
  };
}
