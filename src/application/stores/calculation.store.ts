import { create } from 'zustand';
import { Calculation } from '../../domain/entities/calculation.entity';
import { MarginSimulation } from '../../domain/entities/margin-simulation.entity';
import { ProfitAnalysis } from '../../domain/entities/profit-analysis.entity';
import { CalculationRepository } from '../../domain/repositories/calculation.repository';
import { MarginSimulationRepository } from '../../domain/repositories/margin-simulation.repository';
import { ProfitAnalysisRepository } from '../../domain/repositories/profit-analysis.repository';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import {
  CreateCalculationDTO,
  MarginSimulationDTO,
  ProfitAnalysisDTO,
} from '../dtos/calculation.dto';

interface CalculationState {
  calculations: Calculation[];
  marginSimulations: MarginSimulation[];
  profitAnalyses: ProfitAnalysis[];
  selectedCalculation: Calculation | null;
  isLoading: boolean;
  error: string | null;

  setRepositories: (repos: {
    calculation: CalculationRepository;
    margin: MarginSimulationRepository;
    profit: ProfitAnalysisRepository;
    recipe: RecipeRepository;
  }) => void;
  fetchCalculations: () => Promise<void>;
  fetchByProductId: (productId: string) => Promise<void>;
  loadMaterialCost: (productId: string) => Promise<number>;
  calculateHpp: (data: CreateCalculationDTO, materialCost: number) => Promise<void>;
  simulateMargin: (data: MarginSimulationDTO, hppPerUnit: number) => Promise<void>;
  analyzeProfit: (data: ProfitAnalysisDTO) => Promise<void>;
  reset: () => void;
}

export const useCalculationStore = create<CalculationState>()((set, get) => {
  let calculationRepo: CalculationRepository | null = null;
  let marginRepo: MarginSimulationRepository | null = null;
  let profitRepo: ProfitAnalysisRepository | null = null;
  let recipeRepo: RecipeRepository | null = null;

  return {
    calculations: [],
    marginSimulations: [],
    profitAnalyses: [],
    selectedCalculation: null,
    isLoading: false,
    error: null,

    setRepositories: (repos) => {
      calculationRepo = repos.calculation;
      marginRepo = repos.margin;
      profitRepo = repos.profit;
      recipeRepo = repos.recipe;
    },

    fetchCalculations: async () => {
      if (!calculationRepo) return;
      set({ isLoading: true, error: null });
      try {
        const calculations = await calculationRepo.findAll();
        set({ calculations, isLoading: false });
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    fetchByProductId: async (productId) => {
      if (!calculationRepo || !marginRepo || !profitRepo) return;
      set({ isLoading: true, error: null });
      try {
        const [calculations, marginSimulations, profitAnalyses] =
          await Promise.all([
            calculationRepo.findByProductId(productId),
            marginRepo.findByProductId(productId),
            profitRepo.findByProductId(productId),
          ]);
        set({
          calculations,
          marginSimulations,
          profitAnalyses,
          isLoading: false,
        });
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    loadMaterialCost: async (productId) => {
      if (!recipeRepo) return 0;
      const recipes = await recipeRepo.findByProductId(productId);
      return recipes.reduce((sum, r) => sum + r.subtotal, 0);
    },

    calculateHpp: async (data, materialCost) => {
      if (!calculationRepo) return;
      set({ isLoading: true, error: null });
      try {
        const totalHpp =
          materialCost + data.overheadCost + data.laborCost + data.otherCost;
        const hppPerUnit = totalHpp / data.quantityProduced;

        const calculation = await calculationRepo.create({
          productId: data.productId,
          totalHpp,
          totalMaterialCost: materialCost,
          overheadCost: data.overheadCost,
          laborCost: data.laborCost,
          otherCost: data.otherCost,
          quantityProduced: data.quantityProduced,
          hppPerUnit,
          notes: data.notes ?? null,
        });

        set((state) => ({
          calculations: [...state.calculations, calculation],
          selectedCalculation: calculation,
          isLoading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    simulateMargin: async (data, hppPerUnit) => {
      if (!marginRepo) return;
      set({ isLoading: true, error: null });
      try {
        const decimalMargin = data.desiredMarginPercent / 100;
        const suggestedPrice = hppPerUnit / (1 - decimalMargin);
        const profitPerUnit = suggestedPrice - hppPerUnit;
        const totalProfit = profitPerUnit * data.quantitySold;

        await marginRepo.deactivateByProductId(data.productId);

        const simulation = await marginRepo.create({
          calculationId: data.calculationId,
          productId: data.productId,
          desiredMarginPercent: data.desiredMarginPercent,
          suggestedPrice,
          estimatedProfitPerUnit: profitPerUnit,
          estimatedTotalProfit: totalProfit,
          isActive: true,
        });

        set((state) => ({
          marginSimulations: [...state.marginSimulations, simulation],
          isLoading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    analyzeProfit: async (data) => {
      if (!profitRepo) return;
      set({ isLoading: true, error: null });
      try {
        const grossProfit = data.totalRevenue - data.totalHpp;
        const netProfit = grossProfit - data.operationalCost;
        const marginPercent =
          data.totalRevenue > 0
            ? (grossProfit / data.totalRevenue) * 100
            : 0;

        const analysis = await profitRepo.create({
          productId: data.productId,
          periodStart: data.periodStart,
          periodEnd: data.periodEnd,
          totalRevenue: data.totalRevenue,
          totalHpp: data.totalHpp,
          grossProfit,
          operationalCost: data.operationalCost,
          netProfit,
          marginPercent,
          notes: data.notes ?? null,
        });

        set((state) => ({
          profitAnalyses: [...state.profitAnalyses, analysis],
          isLoading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    reset: () =>
      set({
        calculations: [],
        marginSimulations: [],
        profitAnalyses: [],
        selectedCalculation: null,
        isLoading: false,
        error: null,
      }),
  };
});
