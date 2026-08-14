export type TimeFilterType = '7D' | '30D' | 'Quarter' | 'Year';

export interface OpportunityCorridorItem {
  id: string;
  origin: string;
  destination: string;
  routeCode: string;
  growth: string;
  profitability: string;
  efficiency: string;
  confidenceScore: number; // 0 - 100
  status: 'accelerating' | 'surging' | 'emerging';
  relatedFallingRouteId?: string;
  relatedFallingRouteName?: string;
  aiSummary: string;
}

export interface GrowthSignalItem {
  id: string;
  category: 'cargo' | 'tradelane' | 'region' | 'customer' | 'market';
  title: string;
  subtitle: string;
  growthMetric: string;
  margin: string;
  opportunityScore: number;
  description: string;
  relatedFallingContext?: string;
}

export interface OpportunityRegionItem {
  id: string;
  region: string;
  code: string;
  lat: number;
  lng: number;
  revenueGrowth: string;
  demandGrowth: string;
  reliabilityScore: number;
  opportunityScore: number;
  status: 'prime_growth' | 'high_demand' | 'emerging_hub';
  aiSummary: string;
  relatedFallingRegion?: string;
}

export interface TopRouteItem {
  id: string;
  name: string;
  originCode: string;
  destCode: string;
  profitability: string;
  growth: string;
  reliability: string;
  opportunityScore: number;
  volumeTEU: string;
  transitDays: string;
  relatedFallingRoute: string;
  aiInsight: string;
}

export interface TopCustomerItem {
  id: string;
  name: string;
  industry: string;
  growthRate: string;
  margin: string;
  revenueValue: string;
  aiRecommendation: string;
  logoInitial: string;
}

export interface CargoPerformanceItem {
  id: string;
  category: string;
  growthRate: string;
  margin: string;
  volumeIndex: number;
  forecastSignal: 'Strong Surge' | 'Steady Climb' | 'High Value Priority';
  demandDrivers: string;
}

export interface ExternalSignalItem {
  id: string;
  type: 'weather' | 'port' | 'geopolitical' | 'fuel' | 'trade' | 'logistics';
  title: string;
  impact: string;
  location: string;
  status: 'Favorable' | 'Optimal' | 'Stable' | 'Cost Saving';
  aiSummary: string;
}

export interface AiRecommendationItem {
  id: string;
  title: string;
  action: string;
  expectedImpact: string;
  confidence: string;
  category: 'Capacity Shift' | 'Regional Expansion' | 'Priority Cargo' | 'Route Optimization';
  primaryButtonText: string;
}

export interface RouteComparisonData {
  id: string;
  title: string;
  routeA: {
    name: string;
    code: string;
    profitability: number; // %
    reliability: number; // %
    demandSurge: number; // %
    weatherScore: number; // 0-100
    geoStability: number; // 0-100
    congestionScore: number; // 0-100 (lower is better)
    opportunityScore: number; // 0-100
  };
  routeB: {
    name: string;
    code: string;
    profitability: number;
    reliability: number;
    demandSurge: number;
    weatherScore: number;
    geoStability: number;
    congestionScore: number;
    opportunityScore: number;
  };
}
