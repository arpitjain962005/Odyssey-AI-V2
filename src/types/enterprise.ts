// Network Types
export interface NetworkNodeDetail {
  id: string;
  name: string;
  code: string;
  region: string;
  type: 'Sea Port' | 'Air Hub' | 'Rail Terminal' | 'Fulfillment Center';
  status: 'Optimal' | 'Elevated Load' | 'Severe Bottleneck';
  dwellTimeAvg: string;
  gateCongestionPct: number;
  capacityUtilizationPct: number;
  activeShipmentsCount: number;
  coordinates: { x: number; y: number };
  recentEvents: string[];
}

export interface NetworkCorridorDetail {
  id: string;
  name: string;
  origin: string;
  destination: string;
  mode: 'Sea' | 'Air' | 'Rail' | 'Road';
  status: 'Optimal' | 'Delayed' | 'Congested';
  transitAvgHours: number;
  activeVessels: number;
  weeklyCapacityTeu: number;
  onTimeRatePct: number;
}

// Targets Types
export interface PerformanceTarget {
  id: string;
  category: 'SLA & OTIF' | 'Transit Speed' | 'Financial & Cost' | 'Sustainability / ESG';
  metric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: 'Ahead' | 'On Track' | 'At Risk' | 'Critical Gap';
  quarter: string;
  trendPct: number;
  owner: string;
  aiInsights: string;
}

// Reports Types
export interface ExecutiveReportDoc {
  id: string;
  title: string;
  category: 'Operational Audit' | 'Financial & Margin' | 'Corridor Resilience' | 'Bottleneck Briefing';
  author: string;
  generatedDate: string;
  fileSize: string;
  readTime: string;
  keyTakeaway: string;
  contentSnippet: string;
  highlights: string[];
  status: 'Published' | 'Draft' | 'Scheduled';
}

// Settings Types
export interface AlertThresholdConfig {
  id: string;
  name: string;
  description: string;
  currentThreshold: string;
  unit: string;
  level: 'High' | 'Medium' | 'Low';
  enabled: boolean;
}

// Smart Staff & Agent Connection Node Types
export interface SmartStaffAgent {
  id: string;
  name: string;
  role: string;
  purpose: string;
  status: 'Online' | 'Active' | 'Analyzing' | 'Idle';
  watching: string;
  latestSummary: string;
  avatarIcon: string;
  endpoint: string;
  webhookEnvVar: string;
  isWebhookConfigured?: boolean;
  capabilities: string[];
  primaryAction: {
    id: string;
    label: string;
    task: string;
    taskDescription: string;
  };
  secondaryAction: {
    id: string;
    label: string;
    navId: string;
  };
  sampleResult?: string;
  // Optional historical telemetry metrics
  tasksCompletedToday?: number;
  accuracyRate?: string;
  specialty?: string;
  lastAction?: {
    description: string;
    timestamp: string;
    impact: string;
  };
  metrics?: {
    latency: string;
    costSavedWeek: string;
    reroutesExecuted: number;
  };
}

export interface AgentRunResult {
  status: 'success' | 'error';
  agent: string;
  agentName: string;
  role: string;
  source: 'local_prototype' | 'external_webhook';
  task: string;
  summary: string;
  findings: Array<{
    title: string;
    detail: string;
    severity?: 'info' | 'warning' | 'critical' | 'resolved';
    highlight?: string;
  }>;
  recommendations: string[];
  metrics?: Record<string, string | number>;
  suggestedAction?: {
    label: string;
    navId: string;
  };
  timestamp: string;
  webhookStatus?: {
    configured: boolean;
    urlConfigured?: string;
    envVar: string;
  };
}

export interface StaffActivityItem {
  id: string;
  time: string;
  agentName: string;
  agentId: string;
  role: string;
  action: string;
  detail: string;
  impact?: string;
  targetNavId?: string;
}
