import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text } from 'react-native';

import { RootStackParamList, MainTabParamList } from './types';
import { colors, darkColors } from '../../shared/constants/colors';
import { useTheme } from '../../shared/hooks/useTheme';
import { spacing, fontSize, shadows } from '../../shared/constants/spacing';
import { useAuthStore } from '../../application/stores/auth.store';

import { DashboardScreen } from '../screens/dashboard/dashboard-screen';
import { RawMaterialListScreen } from '../screens/raw-material/raw-material-list-screen';
import { RawMaterialFormScreen } from '../screens/raw-material/raw-material-form-screen';
import { ProductListScreen } from '../screens/product/product-list-screen';
import { ProductFormScreen } from '../screens/product/product-form-screen';
import { RecipeFormScreen } from '../screens/recipe/recipe-form-screen';
import { HppCalculatorScreen } from '../screens/hpp/hpp-calculator-screen';
import { MarginSimulationScreen } from '../screens/margin/margin-simulation-screen';
import { ProfitAnalysisScreen } from '../screens/profit/profit-analysis-screen';
import { HistoryScreen } from '../screens/history/history-screen';
import { CashBookScreen } from '../screens/cash-book/cash-book-screen';
import { CashierScreen } from '../screens/cashier/cashier-screen';
import { DebtsScreen } from '../screens/debts/debts-screen';
import { MarketplaceFeesScreen } from '../screens/marketplace-fees/marketplace-fees-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({
  focused,
  iconName,
  label,
}: {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      {focused ? (
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Ionicons name={iconName} size={20} color="white" />
        </LinearGradient>
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: 'transparent' }]}>
          <Ionicons name={iconName} size={24} color={isDark ? colors.gray[400] : colors.gray[500]} />
        </View>
      )}
      {focused && (
        <Text style={[styles.label, { color: colors.primary[500] }]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </View>
  );
}

function MainTabs() {
  const { colors, isDark } = useTheme();
  const role = useAuthStore((s) => s.role);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? colors.gray[800] : colors.white,
          borderTopWidth: 0,
          paddingTop: spacing.sm,
          paddingBottom: spacing.lg,
          paddingHorizontal: spacing.sm,
          height: 72,
          ...shadows.lg,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName={focused ? 'home' : 'home-outline'}
              label="Beranda"
            />
          ),
        }}
      />
      {role === 'OWNER' && (
        <>
          <Tab.Screen
            name="RawMaterials"
            component={RawMaterialListScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  iconName={focused ? 'cube' : 'cube-outline'}
                  label="Bahan"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Products"
            component={ProductListScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  iconName={focused ? 'archive' : 'archive-outline'}
                  label="Produk"
                />
              ),
            }}
          />
          <Tab.Screen
            name="MarketplaceFees"
            component={MarketplaceFeesScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  iconName={focused ? 'cart' : 'cart-outline'}
                  label="Marketplace"
                />
              ),
            }}
          />
        </>
      )}
      <Tab.Screen
        name="Cashier"
        component={CashierScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName={focused ? 'cash' : 'cash-outline'}
              label="Kasir"
            />
          ),
        }}
      />
      <Tab.Screen
        name="CashBook"
        component={CashBookScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName={focused ? 'journal' : 'journal-outline'}
              label="Buku Kas"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Debts"
        component={DebtsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName={focused ? 'document-text' : 'document-text-outline'}
              label="Bon"
            />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName={focused ? 'time' : 'time-outline'}
              label="Riwayat"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: colors.primary[500],
        headerStyle: {
          backgroundColor: isDark ? colors.gray[800] : colors.white,
        },
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RawMaterialForm"
        component={RawMaterialFormScreen}
        options={{
          title: 'Bahan Baku',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={{
          title: 'Produk',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="RecipeForm"
        component={RecipeFormScreen}
        options={{
          title: 'Resep Produk',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="HppCalculator"
        component={HppCalculatorScreen}
        options={{
          title: 'Hitung HPP',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="MarginSimulation"
        component={MarginSimulationScreen}
        options={{
          title: 'Simulasi Margin',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="ProfitAnalysis"
        component={ProfitAnalysisScreen}
        options={{
          title: 'Analisis Laba',
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabItemFocused: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.xxs,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
