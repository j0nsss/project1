import { useEffect, useState, PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { env } from '../config/env';
import { initializeDatabase } from '../infrastructure/database/database';
import {
  initializeRepositories,
  initializeMockRepositories,
  RepositoryCollection,
} from '../infrastructure/database/repository-initializer';
import { useRawMaterialStore } from '../application/stores/raw-material.store';
import { useProductStore } from '../application/stores/product.store';
import { useCalculationStore } from '../application/stores/calculation.store';
import { useRecipeStore } from '../application/stores/recipe.store';
import { useCashBookStore } from '../application/stores/cash-book.store';
import { useDebtStore } from '../application/stores/debt.store';
import { useUIStore } from '../application/stores/ui.store';
import { RootNavigator } from '../presentation/navigation/root-navigator';
import { ToastContainer } from '../presentation/components/ui/toast';
import { Loading } from '../presentation/components/ui/loading';
import { ErrorBoundary } from '../presentation/components/ui/error-boundary';

function wireRepositories(repos: RepositoryCollection) {
  useRawMaterialStore.getState().setRepository(repos.rawMaterialRepository);
  useProductStore.getState().setRepository(repos.productRepository);
  useRecipeStore.getState().setRepository(repos.recipeRepository);
  useCashBookStore.getState().setRepository(repos.cashEntryRepository);
  useDebtStore.getState().setRepository(repos.debtRepository);
  useCalculationStore.getState().setRepositories({
    calculation: repos.calculationRepository,
    margin: repos.marginSimulationRepository,
    profit: repos.profitAnalysisRepository,
    recipe: repos.recipeRepository,
  });
}

export function Providers({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAppReady = useUIStore((s) => s.setAppReady);

  useEffect(() => {
    async function init() {
      try {
        if (env.USE_DUMMY_DATA) {
          const repos = initializeMockRepositories();
          wireRepositories(repos);
        } else {
          const db = await initializeDatabase();
          const repos = initializeRepositories(db);
          wireRepositories(repos);
        }

        setAppReady(true);
        setIsReady(true);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    init();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Loading message={`Gagal memuat: ${error}`} />
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.center}>
        <Loading fullScreen message="Memuat aplikasi..." />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer>
            <StatusBar style="dark" />
            {children}
            <ToastContainer />
          </NavigationContainer>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
