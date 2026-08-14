export type RevenueMetricType = 'revenue' | 'profit' | 'margin' | 'cost';
export type TimeFilterType = '7D' | '30D' | 'Quarter' | 'Year';

export interface FinancialTrendPoint {
  label: string;
  revenue: number; // in $ Millions
  profit: number; // in $ Millions
  margin: number; // percentage (e.g. 26.5)
  cost: number; // in $ Millions
}

export interface DistributionItem {
  id: string;
  name: string;
  value: number; // e.g., 20.2 ($M)
  percentage: number; // e.g. 42%
  color: string;
  growth: string;
}

export interface RevenueBreakdownData {
  byMode: DistributionItem[];
  byRegion: DistributionItem[];
  byBusinessUnit: DistributionItem[];
}

export interface CostCategoryItem {
  id: string;
  category: string;
  amount: number; // in $ Millions
  percentage: number;
  color: string;
  trend: string;
  isSavingTarget?: boolean;
}

export interface RegionalPerformanceItem {
  id: string;
  region: string;
  code: string;
  revenue: string;
  profit: string;
  margin: string;
  shipments: number;
  growth: string;
  lat: number;
  lng: number;
  status: 'top_performer' | 'steady' | 'opportunity' | 'watch';
}

export interface CustomerPerformanceItem {
  id: string;
  name: string;
  logoInitial: string;
  industry: string;
  revenue: string;
  profitMargin: string;
  growth: string;
  score: number; // 0 - 100
  tier: 'Strategic Key Account' | 'High Growth' | 'Core Enterprise' | 'Watchlist';
  badgeColor: string;
}

export interface FinancialAiInsight {
  id: string;
  type: 'saving' | 'growth' | 'risk' | 'optim' | 'pricing';
  title: string;
  description: string;
  impactValue: string;
  confidence: string;
  suggestedAction: string;
  primaryActionLabel: string;
}

export interface FinancialOpportunityItem {
  id: string;
  title: string;
  category: 'High-Margin Route' | 'Fast-Growing Account' | 'Cost Reduction' | 'Market Expansion';
  potentialValue: string;
  marginBoost: string;
  description: string;
  readinessScore: number;
}

export interface FinancialActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'contract' | 'rebate' | 'cost_saving' | 'tariff' | 'billing';
  amount?: string;
  impact: 'positive' | 'neutral' | 'attention';
}
