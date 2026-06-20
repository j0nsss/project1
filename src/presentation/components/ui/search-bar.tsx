import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius, fontSize } from '../../../shared/constants/spacing';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: any;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Cari...',
  onClear,
  style,
}: SearchBarProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={isDark ? colors.gray[400] : colors.gray[500]}
          style={styles.icon}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? colors.white : colors.black,
              placeholderTextColor: isDark ? colors.gray[400] : colors.gray[400],
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? colors.gray[400] : colors.gray[400]}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onClear || (() => onChangeText(''))}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={isDark ? colors.gray[400] : colors.gray[400]}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
});
