export type RootStackParamList = {
  MainTabs: undefined;
  RawMaterialForm: { id?: string };
  ProductForm: { id?: string };
  RecipeForm: { productId: string; productName: string };
  HppCalculator: { productId: string; productName: string };
  MarginSimulation: { calculationId: string; productId: string; productName: string; hppPerUnit: number };
  ProfitAnalysis: { productId?: string };
  ProfitAnalysisDetail: { analysisId: string };
  CalculationHistory: { productId?: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  RawMaterials: undefined;
  Products: undefined;
  CashBook: undefined;
  Cashier: undefined;
  Debts: undefined;
  MarketplaceFees: undefined;
  History: undefined;
};
