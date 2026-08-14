// API client service for Odyssey AI V2

export async function fetchDashboardData() {
  const res = await fetch('/api/dashboard');
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export async function fetchJourneys(params?: { mode?: string; status?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params?.mode && params.mode !== 'all') query.set('mode', params.mode);
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`/api/journeys?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch journeys');
  return res.json();
}

export async function fetchJourneyById(id: string) {
  const res = await fetch(`/api/journeys/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch journey ${id}`);
  return res.json();
}

export async function executeJourneyAction(id: string, actionId: string, actionLabel: string) {
  const res = await fetch(`/api/journeys/${id}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionId, actionLabel })
  });
  if (!res.ok) throw new Error('Failed to execute journey action');
  return res.json();
}

export async function fetchRisingData() {
  const res = await fetch('/api/rising');
  if (!res.ok) throw new Error('Failed to fetch rising data');
  return res.json();
}

export async function fetchFallingData() {
  const res = await fetch('/api/falling');
  if (!res.ok) throw new Error('Failed to fetch falling data');
  return res.json();
}

export async function mitigateRiskSignal(signalId: string) {
  const res = await fetch('/api/falling/mitigate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signalId })
  });
  if (!res.ok) throw new Error('Failed to mitigate risk signal');
  return res.json();
}

export async function fetchNetworkData() {
  const res = await fetch('/api/network');
  if (!res.ok) throw new Error('Failed to fetch network data');
  return res.json();
}

export async function fetchRevenueData() {
  const res = await fetch('/api/revenue');
  if (!res.ok) throw new Error('Failed to fetch revenue data');
  return res.json();
}

export async function fetchTargetsData() {
  const res = await fetch('/api/targets');
  if (!res.ok) throw new Error('Failed to fetch targets data');
  return res.json();
}

export async function fetchReportsData() {
  const res = await fetch('/api/reports');
  if (!res.ok) throw new Error('Failed to fetch reports data');
  return res.json();
}

export async function generateLiveReport() {
  const res = await fetch('/api/reports/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to generate report');
  return res.json();
}

export async function fetchSmartStaffData() {
  const res = await fetch('/api/agents');
  if (!res.ok) throw new Error('Failed to fetch smart staff data');
  return res.json();
}

export async function fetchAgentsList() {
  const res = await fetch('/api/agents');
  if (!res.ok) throw new Error('Failed to fetch agent list');
  return res.json();
}

export async function runAgentNode(endpoint: string, task?: string, filters?: any, context?: any) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, filters, context })
  });
  if (!res.ok) throw new Error(`Agent run failed at ${endpoint}`);
  return res.json();
}

export async function runJourneyMonitor(task = 'run_check', filters?: any) {
  return runAgentNode('/api/agents/journey-monitor', task, filters);
}

export async function runRouteAnalyst(task = 'analyze_routes', filters?: any) {
  return runAgentNode('/api/agents/route-analyst', task, filters);
}

export async function runRiskAnalyst(task = 'run_risk_check', filters?: any) {
  return runAgentNode('/api/agents/risk-analyst', task, filters);
}

export async function runRevenueAnalyst(task = 'analyze_performance', filters?: any) {
  return runAgentNode('/api/agents/revenue-analyst', task, filters);
}

export async function runSmartStaffAgent(agentId: string) {
  // Map legacy ids to node endpoints
  const endpointMap: Record<string, string> = {
    'journey-monitor': '/api/agents/journey-monitor',
    'route-analyst': '/api/agents/route-analyst',
    'risk-analyst': '/api/agents/risk-analyst',
    'revenue-analyst': '/api/agents/revenue-analyst',
    'agent-1': '/api/agents/journey-monitor',
    'agent-2': '/api/agents/route-analyst',
    'agent-3': '/api/agents/risk-analyst',
    'agent-4': '/api/agents/revenue-analyst'
  };
  const ep = endpointMap[agentId] || '/api/agents/journey-monitor';
  return runAgentNode(ep);
}

export async function fetchSettingsData() {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSetting(id: string, updates: { enabled?: boolean; currentThreshold?: string }) {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates })
  });
  if (!res.ok) throw new Error('Failed to update setting');
  return res.json();
}
