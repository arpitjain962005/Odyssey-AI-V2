export interface FallingCorridor {
  id: string;
  lane: string;
  mode: 'Sea' | 'Air' | 'Rail' | 'Road';
  leadTimeVariance: string; // e.g., '+2.4 days'
  delayProbability: number; // percentage
  primaryIssue: string;
  impactScore: 'Critical' | 'High' | 'Medium';
  weeklyVolumeLoss: string;
  marginImpact: string;
  alternativeLaneId?: string;
  alternativeLaneName?: string;
}

export interface RiskSignal {
  id: string;
  type: 'congestion' | 'weather' | 'customs' | 'carrier' | 'geopolitical';
  title: string;
  location: string;
  affectedShipments: number;
  severity: 'critical' | 'high' | 'medium';
  timeDetected: string;
  mitigationStatus: 'action_required' | 'monitoring' | 'rerouting';
  recommendedAction: string;
}

export interface AtRiskCustomer {
  id: string;
  customerName: string;
  tier: 'Enterprise VIP' | 'Key Account' | 'Standard';
  impactedShipments: number;
  delayedValue: string;
  currentSla: string;
  targetSla: string;
  riskFactor: string;
  accountOwner: string;
}

export interface CostEscalationItem {
  id: string;
  category: string;
  corridor: string;
  currentVariance: string;
  projectedOverrun: string;
  driver: string;
  status: 'Critical' | 'Warning' | 'Moderate';
}
