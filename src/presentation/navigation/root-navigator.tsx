import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from './types';
import { colors } from '../../shared/constants/colors';

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

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="RawMaterials"
        component={RawMaterialListScreen}
        options={{ tabBarLabel: 'Bahan Baku' }}
      />
      <Tab.Screen
        name="Products"
        component={ProductListScreen}
        options={{ tabBarLabel: 'Produk' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarLabel: 'Riwayat' }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: colors.primary[600],
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
        options={{ title: 'Bahan Baku' }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={{ title: 'Produk' }}
      />
      <Stack.Screen
        name="RecipeForm"
        component={RecipeFormScreen}
        options={{ title: 'Resep Produk' }}
      />
      <Stack.Screen
        name="HppCalculator"
        component={HppCalculatorScreen}
        options={{ title: 'Hitung HPP' }}
      />
      <Stack.Screen
        name="MarginSimulation"
        component={MarginSimulationScreen}
        options={{ title: 'Simulasi Margin' }}
      />
      <Stack.Screen
        name="ProfitAnalysis"
        component={ProfitAnalysisScreen}
        options={{ title: 'Analisis Laba' }}
      />
    </Stack.Navigator>
  );
}
