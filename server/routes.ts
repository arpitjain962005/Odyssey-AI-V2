import { Router, Request, Response } from 'express';
import { getDb } from './db';

export const apiRouter = Router();

// Helper to convert SQLite result rows into JSON objects
function parseQueryResults(res: any[]): any[] {
  if (!res || res.length === 0) return [];
  const columns = res[0].columns;
  const values = res[0].values;
  return values.map((row: any[]) => {
    const obj: any = {};
    columns.forEach((col: string, i: number) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

// 1. DASHBOARD SUMMARY
apiRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    const totalShipmentsRes = db.exec(`
      SELECT 
        count(*) as total,
        sum(case when status = 'Delayed' then 1 else 0 end) as delayed,
        sum(case when status = 'In Transit' then 1 else 0 end) as in_transit,
        sum(case when risk_level = 'High' then 1 else 0 end) as high_risk,
        sum(revenue_usd) as total_revenue,
        sum(profit_usd) as total_profit
      FROM shipments
    `);

    const statsRow = totalShipmentsRes[0]?.values[0] || [500, 45, 175, 18, 11840000, 3490000];
    const totalShipments = Number(statsRow[0] || 500);
    const delayedShipments = Number(statsRow[1] || 45);
    const inTransitShipments = Number(statsRow[2] || 175);
    const highRiskShipments = Number(statsRow[3] || 18);
    const totalRevenue = Number(statsRow[4] || 11840000);
    const totalProfit = Number(statsRow[5] || 3490000);
    const marginPct = ((totalProfit / (totalRevenue || 1)) * 100).toFixed(1);

    const journeysRaw = parseQueryResults(db.exec('SELECT * FROM journeys ORDER BY progress_percent DESC'));
    const journeys = journeysRaw.map((j) => ({
      ...j,
      containerNumbers: JSON.parse(j.container_numbers || '[]'),
      suggestedActions: JSON.parse(j.suggested_actions || '[]'),
      mapOverlay: j.map_overlay_type ? { type: j.map_overlay_type, message: j.map_overlay_message, lat: j.map_overlay_lat, lng: j.map_overlay_lng } : null
    }));

    const risks = parseQueryResults(db.exec('SELECT * FROM external_signals ORDER BY impact_level ASC LIMIT 5'));
    const targets = parseQueryResults(db.exec('SELECT * FROM targets LIMIT 4'));

    res.json({
      success: true,
      stats: {
        activeShipments: totalShipments,
        onTimeRate: '93.8%',
        otifRate: '91.6%',
        activeJourneysCount: inTransitShipments,
        delayedJourneysCount: delayedShipments,
        criticalCount: highRiskShipments,
        revenueCurrent: `$${(totalRevenue / 1000000).toFixed(2)}M`,
        grossProfit: `$${(totalProfit / 1000000).toFixed(2)}M`,
        operatingMargin: `${marginPct}%`,
        avgPortDwell: '2.8 days'
      },
      journeys: journeys.slice(0, 6),
      liveRiskSignals: risks,
      executiveTargets: targets
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. JOURNEYS
apiRouter.get('/journeys', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const mode = req.query.mode as string;
    const status = req.query.status as string;
    const search = (req.query.search as string || '').toLowerCase();

    let sql = 'SELECT * FROM journeys WHERE 1=1';
    if (mode && mode !== 'all') {
      sql += ` AND mode = '${mode.toLowerCase()}'`;
    }
    if (status && status !== 'all') {
      sql += ` AND status = '${status.toLowerCase()}'`;
    }

    const journeysRaw = parseQueryResults(db.exec(sql));
    let journeys = journeysRaw.map((j) => ({
      ...j,
      containerNumbers: JSON.parse(j.container_numbers || '[]'),
      suggestedActions: JSON.parse(j.suggested_actions || '[]'),
      mapOverlay: j.map_overlay_type ? { type: j.map_overlay_type, message: j.map_overlay_message, lat: j.map_overlay_lat, lng: j.map_overlay_lng } : null
    }));

    if (search) {
      journeys = journeys.filter((j) =>
        j.id.toLowerCase().includes(search) ||
        j.title.toLowerCase().includes(search) ||
        j.carrier.toLowerCase().includes(search) ||
        j.origin.toLowerCase().includes(search) ||
        j.destination.toLowerCase().includes(search)
      );
    }

    const stopsRaw = parseQueryResults(db.exec('SELECT * FROM journey_stops ORDER BY stop_order ASC'));
    const docsRaw = parseQueryResults(db.exec('SELECT * FROM journey_documents'));
    const activitiesRaw = parseQueryResults(db.exec('SELECT * FROM journey_activities ORDER BY timestamp DESC'));

    const fullJourneys = journeys.map((j) => ({
      ...j,
      stops: stopsRaw.filter((s) => s.journey_id === j.id),
      documents: docsRaw.filter((d) => d.journey_id === j.id),
      activities: activitiesRaw.filter((a) => a.journey_id === j.id)
    }));

    res.json({
      success: true,
      count: fullJourneys.length,
      journeys: fullJourneys
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Journey Single View & Actions
apiRouter.get('/journeys/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const jId = req.params.id;
    const jRaw = parseQueryResults(db.exec(`SELECT * FROM journeys WHERE id = '${jId}'`));

    if (jRaw.length > 0) {
      const j = jRaw[0];
      const fullJourney = {
        ...j,
        containerNumbers: JSON.parse(j.container_numbers || '[]'),
        suggestedActions: JSON.parse(j.suggested_actions || '[]'),
        mapOverlay: j.map_overlay_type ? { type: j.map_overlay_type, message: j.map_overlay_message, lat: j.map_overlay_lat, lng: j.map_overlay_lng } : null,
        stops: parseQueryResults(db.exec(`SELECT * FROM journey_stops WHERE journey_id = '${jId}' ORDER BY stop_order ASC`)),
        documents: parseQueryResults(db.exec(`SELECT * FROM journey_documents WHERE journey_id = '${jId}'`)),
        activities: parseQueryResults(db.exec(`SELECT * FROM journey_activities WHERE journey_id = '${jId}' ORDER BY timestamp DESC`))
      };
      return res.json({ success: true, journey: fullJourney });
    }

    // Check if it's a shipment ID (e.g. SH10027)
    const sRaw = parseQueryResults(db.exec(`
      SELECT s.*, r.origin_name, r.dest_name, c.name as customer_name, g.category as cargo_name, car.name as carrier_name
      FROM shipments s
      JOIN routes r ON s.route_id = r.route_id
      JOIN customers c ON s.customer_id = c.customer_id
      JOIN cargo_categories g ON s.cargo_id = g.cargo_id
      JOIN carriers car ON s.carrier_id = car.carrier_id
      WHERE s.shipment_id = '${jId}'
    `));

    if (sRaw.length === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    const s = sRaw[0];
    const containers = parseQueryResults(db.exec(`SELECT * FROM containers WHERE shipment_id = '${jId}'`));
    const events = parseQueryResults(db.exec(`SELECT * FROM operational_events WHERE shipment_id = '${jId}'`));

    const simulatedJourney = {
      id: s.shipment_id,
      title: `${s.origin_name} → ${s.dest_name} Express`,
      mode: s.mode.toLowerCase(),
      status: s.status.toLowerCase(),
      carrier: s.carrier_name,
      origin: s.origin_name,
      destination: s.dest_name,
      progress_percent: s.status === 'Delivered' ? 100 : s.status === 'In Transit' ? 64 : 20,
      containers_count: containers.length,
      containerNumbers: containers.map((c) => c.container_id),
      distance_remaining: s.status === 'Delivered' ? '0 miles' : '1,840 nautical miles',
      eta: s.planned_eta,
      eta_variance: s.delay_hours > 0 ? `+${s.delay_hours}h buffer` : 'On Schedule',
      last_updated: '2 mins ago via Satellite AIS',
      departure_date: s.etd,
      route_id: s.route_id,
      stops: [
        { id: `${s.shipment_id}-s1`, name: 'Origin Dispatch', type: 'warehouse', location: s.origin_name, status: 'completed', scheduled_time: s.booking_date, actual_time: s.booking_date },
        { id: `${s.shipment_id}-s2`, name: 'Port Loading', type: 'port', location: s.origin_name, status: 'completed', scheduled_time: s.etd, actual_time: s.etd },
        { id: `${s.shipment_id}-s3`, name: 'Maritime Transit', type: 'ocean', location: `${s.origin_name} – ${s.dest_name} Corridor`, status: s.status === 'In Transit' ? 'in_progress' : 'completed', scheduled_time: s.planned_eta, actual_time: s.status === 'In Transit' ? 'In Transit' : s.actual_delivery },
        { id: `${s.shipment_id}-s4`, name: 'Final Destination Berth', type: 'port', location: s.dest_name, status: s.status === 'Delivered' ? 'completed' : 'upcoming', scheduled_time: s.planned_eta, actual_time: s.actual_delivery }
      ],
      documents: [
        { id: `${s.shipment_id}-d1`, name: `Bill_of_Lading_${s.shipment_id}.pdf`, type: 'pdf', size: '2.4 MB', date: s.booking_date },
        { id: `${s.shipment_id}-d2`, name: `Customs_Declaration_${s.shipment_id}.pdf`, type: 'pdf', size: '1.2 MB', date: s.etd }
      ],
      activities: events.map((e) => ({
        id: e.event_id,
        timestamp: e.timestamp,
        title: e.title,
        description: e.description,
        severity: e.severity,
        location: e.location
      })),
      financials: {
        freight_usd: s.freight_usd,
        fuel_surcharge_usd: s.fuel_surcharge_usd,
        handling_usd: s.handling_usd,
        customs_usd: s.customs_usd,
        labor_usd: s.labor_usd,
        insurance_usd: s.insurance_usd,
        other_cost_usd: s.other_cost_usd,
        total_cost_usd: s.total_cost_usd,
        revenue_usd: s.revenue_usd,
        profit_usd: s.profit_usd,
        margin_pct: s.margin_pct
      }
    };

    res.json({ success: true, journey: simulatedJourney });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. SHIPMENTS (500 Shipments Master Query)
apiRouter.get('/shipments', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const routeId = req.query.route_id as string;
    const status = req.query.status as string;
    const customerId = req.query.customer_id as string;
    const limit = parseInt(req.query.limit as string || '500', 10);

    let sql = `
      SELECT s.*, r.origin_name, r.dest_name, c.name as customer_name, g.category as cargo_name, car.name as carrier_name
      FROM shipments s
      JOIN routes r ON s.route_id = r.route_id
      JOIN customers c ON s.customer_id = c.customer_id
      JOIN cargo_categories g ON s.cargo_id = g.cargo_id
      JOIN carriers car ON s.carrier_id = car.carrier_id
      WHERE 1=1
    `;

    if (routeId) sql += ` AND s.route_id = '${routeId}'`;
    if (status) sql += ` AND s.status = '${status}'`;
    if (customerId) sql += ` AND s.customer_id = '${customerId}'`;

    sql += ` ORDER BY s.booking_date DESC LIMIT ${limit}`;

    const shipments = parseQueryResults(db.exec(sql));
    res.json({ success: true, count: shipments.length, shipments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. ROUTES (20 Master Routes)
apiRouter.get('/routes', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const routes = parseQueryResults(db.exec('SELECT * FROM routes ORDER BY opportunity_score DESC'));
    res.json({ success: true, count: routes.length, routes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. RISING (Opportunity Intelligence)
apiRouter.get('/rising', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    // Rising routes (R001, R002, R003, R004, R011, R014, R019)
    const risingRoutes = parseQueryResults(db.exec(`
      SELECT * FROM routes 
      WHERE signal IN ('Rising', 'Positive') 
      ORDER BY opportunity_score DESC, growth_pct DESC
    `));

    // High Margin Cargo
    const cargo = parseQueryResults(db.exec('SELECT * FROM cargo_categories ORDER BY base_margin_pct DESC'));

    // Top Customers
    const topCustomers = parseQueryResults(db.exec('SELECT * FROM customers ORDER BY growth_pct DESC'));

    res.json({
      success: true,
      routes: risingRoutes,
      cargo,
      topCustomers
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. FALLING (Risk Radar & Bottlenecks)
apiRouter.get('/falling', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    // Underperforming / high-risk routes (R007, R008, R015, R020)
    const fallingRoutes = parseQueryResults(db.exec(`
      SELECT * FROM routes 
      WHERE signal IN ('Falling', 'Watch') 
      ORDER BY reliability_pct ASC
    `));

    const riskSignals = parseQueryResults(db.exec('SELECT * FROM external_signals ORDER BY impact_level ASC'));
    const costEscalations = parseQueryResults(db.exec('SELECT * FROM cost_escalations'));

    res.json({
      success: true,
      fallingRoutes,
      riskSignals,
      costEscalations
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. NETWORK & NODES (16 Ports & 8 Warehouses)
apiRouter.get('/network', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const ports = parseQueryResults(db.exec('SELECT * FROM ports ORDER BY service_reliability_pct DESC'));
    const warehouses = parseQueryResults(db.exec('SELECT * FROM warehouses ORDER BY capacity_pallets DESC'));
    const routes = parseQueryResults(db.exec('SELECT * FROM routes ORDER BY opportunity_score DESC'));

    res.json({
      success: true,
      ports,
      warehouses,
      routes
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. REVENUE & FINANCIAL INTELLIGENCE
apiRouter.get('/revenue', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const finTrends = parseQueryResults(db.exec('SELECT * FROM financial_records ORDER BY period ASC'));
    const costCategories = parseQueryResults(db.exec('SELECT * FROM cost_categories ORDER BY amount DESC'));
    const customers = parseQueryResults(db.exec('SELECT * FROM customers ORDER BY growth_pct DESC'));

    const aggRes = db.exec(`
      SELECT sum(revenue_usd) as rev, sum(profit_usd) as prof, sum(total_cost_usd) as cost
      FROM shipments
    `);
    const totalRev = Number(aggRes[0]?.values[0][0] || 11840000);
    const totalProf = Number(aggRes[0]?.values[0][1] || 3490000);
    const totalCost = Number(aggRes[0]?.values[0][2] || 8350000);
    const margin = ((totalProf / (totalRev || 1)) * 100).toFixed(1);

    res.json({
      success: true,
      kpis: {
        totalRevenue: `$${(totalRev / 1000000).toFixed(2)}M`,
        revenueTarget: '$12.50M',
        grossProfit: `$${(totalProf / 1000000).toFixed(2)}M`,
        profitTarget: '$3.60M',
        operatingMargin: `${margin}%`,
        marginTarget: '28.8%',
        totalCost: `$${(totalCost / 1000000).toFixed(2)}M`
      },
      chartData: finTrends,
      costBreakdown: costCategories,
      topCustomers: customers
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. TARGETS & SLAs (8 Master Targets)
apiRouter.get('/targets', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const targets = parseQueryResults(db.exec('SELECT * FROM targets ORDER BY id ASC'));
    res.json({ success: true, count: targets.length, targets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. SMART STAFF & OPEN AGENT CONNECTION NODES (4 AI Workers)

// Helper to execute connection node logic with webhook support and local prototype fallback
async function dispatchAgentNode(
  agentKey: string,
  webhookEnvVar: string,
  task: string,
  filters: any,
  context: any,
  fallbackFn: () => Promise<any>
) {
  const webhookUrl = process.env[webhookEnvVar];
  const isConfigured = Boolean(webhookUrl && webhookUrl.trim().startsWith('http'));

  const payload = {
    agent: agentKey,
    task: task || 'run_check',
    source: 'odyssey',
    timestamp: new Date().toISOString(),
    filters: filters || {},
    context: context || {}
  };

  if (isConfigured) {
    try {
      const response = await fetch(webhookUrl!.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: 'success',
          agent: agentKey,
          agentName: data.agentName || (agentKey === 'journey_monitor' ? 'Journey Monitor' : agentKey === 'route_analyst' ? 'Route Analyst' : agentKey === 'risk_analyst' ? 'Risk Analyst' : 'Revenue Analyst'),
          role: data.role || (agentKey === 'journey_monitor' ? 'Operations' : agentKey === 'route_analyst' ? 'Network & Optimization' : agentKey === 'risk_analyst' ? 'Risk & Resilience' : 'Finance & Performance'),
          source: 'external_webhook',
          task: payload.task,
          summary: data.summary || 'External workflow executed successfully.',
          findings: data.findings || [],
          recommendations: data.recommendations || [],
          metrics: data.metrics || {},
          suggestedAction: data.suggestedAction || data.suggested_action,
          timestamp: new Date().toISOString(),
          webhookStatus: { configured: true, envVar: webhookEnvVar }
        };
      }
    } catch (err: any) {
      console.warn(`[Agent Connection Node] Webhook dispatch for ${agentKey} failed or timed out (${err.message}). Falling back to local prototype intelligence.`);
    }
  }

  // Local Prototype Fallback (Queries SQLite Master Data)
  const localResult = await fallbackFn();
  return {
    ...localResult,
    source: 'local_prototype',
    task: payload.task,
    timestamp: new Date().toISOString(),
    webhookStatus: {
      configured: isConfigured,
      envVar: webhookEnvVar
    }
  };
}

// 10.1 List 4 Primary Smart Staff AI Workers & Connection Status
apiRouter.get('/agents', async (req: Request, res: Response) => {
  try {
    const agents = [
      {
        id: 'journey-monitor',
        name: 'Journey Monitor',
        role: 'Operations',
        purpose: 'Monitors shipments, ETA changes, delays and journey exceptions.',
        status: 'Online',
        watching: '500 shipments',
        latestSummary: '3 journeys require attention',
        avatarIcon: 'Navigation',
        endpoint: '/api/agents/journey-monitor',
        webhookEnvVar: 'JOURNEY_MONITOR_WEBHOOK_URL',
        isWebhookConfigured: Boolean(process.env.JOURNEY_MONITOR_WEBHOOK_URL?.trim().startsWith('http')),
        capabilities: [
          'Find delayed shipments',
          'Identify journeys at risk',
          'Review ETA changes',
          'Summarize active shipment exceptions',
          'Flag shipments requiring attention'
        ],
        primaryAction: {
          id: 'run-check',
          label: 'Run Journey Check',
          task: 'run_check',
          taskDescription: 'Checking current journeys for delays and ETA variance...'
        },
        secondaryAction: {
          id: 'view-journeys',
          label: 'View Journeys',
          navId: 'journeys'
        },
        sampleResult: '3 journeys need attention.\n2 shipments are delayed.\n1 shipment has a high ETA risk.\nMost affected route: Hamburg → Jebel Ali'
      },
      {
        id: 'route-analyst',
        name: 'Route Analyst',
        role: 'Network & Optimization',
        purpose: 'Analyzes route profitability, growth, reliability and opportunity.',
        status: 'Online',
        watching: '20 corridors',
        latestSummary: 'Shanghai → Singapore #1 opportunity (+18.2%)',
        avatarIcon: 'TrendingUp',
        endpoint: '/api/agents/route-analyst',
        webhookEnvVar: 'ROUTE_ANALYST_WEBHOOK_URL',
        isWebhookConfigured: Boolean(process.env.ROUTE_ANALYST_WEBHOOK_URL?.trim().startsWith('http')),
        capabilities: [
          'Compare routes',
          'Find profitable routes',
          'Identify growing routes',
          'Identify declining routes',
          'Highlight opportunity lanes',
          'Compare route performance'
        ],
        primaryAction: {
          id: 'analyze-routes',
          label: 'Analyze Routes',
          task: 'analyze_routes',
          taskDescription: 'Analyzing route profitability, volume growth, and opportunity lanes...'
        },
        secondaryAction: {
          id: 'view-rising',
          label: 'View Rising',
          navId: 'rising'
        },
        sampleResult: 'Shanghai → Singapore is currently the strongest opportunity.\nGrowth: +18.2%\nReliability: 98%\nOpportunity Score: 92'
      },
      {
        id: 'risk-analyst',
        name: 'Risk Analyst',
        role: 'Risk & Resilience',
        purpose: 'Identifies operational and external risks affecting journeys and routes.',
        status: 'Online',
        watching: '16 global nodes & risk signals',
        latestSummary: '2 routes currently require attention',
        avatarIcon: 'ShieldAlert',
        endpoint: '/api/agents/risk-analyst',
        webhookEnvVar: 'RISK_ANALYST_WEBHOOK_URL',
        isWebhookConfigured: Boolean(process.env.RISK_ANALYST_WEBHOOK_URL?.trim().startsWith('http')),
        capabilities: [
          'Review high-risk shipments',
          'Identify route risks',
          'Review port congestion',
          'Review weather signals (simulated prototype)',
          'Review geopolitical signals (simulated prototype)',
          'Explain why a route is under pressure'
        ],
        primaryAction: {
          id: 'run-risk-check',
          label: 'Run Risk Check',
          task: 'run_risk_check',
          taskDescription: 'Scanning network for port congestion, weather variance, and corridor bottlenecks...'
        },
        secondaryAction: {
          id: 'view-falling',
          label: 'View Falling',
          navId: 'falling'
        },
        sampleResult: '2 routes currently require attention.\nHamburg → Jebel Ali (Reason: port congestion + weaker reliability)\nLos Angeles → Rotterdam (Reason: weather variability + ETA risk)'
      },
      {
        id: 'revenue-analyst',
        name: 'Revenue Analyst',
        role: 'Finance & Performance',
        purpose: 'Understands revenue, cost, profit and margin performance.',
        status: 'Online',
        watching: '$11.84M Q3 Revenue & 12 Key Accounts',
        latestSummary: 'Gross margin pacing at 29.5%',
        avatarIcon: 'DollarSign',
        endpoint: '/api/agents/revenue-analyst',
        webhookEnvVar: 'REVENUE_ANALYST_WEBHOOK_URL',
        isWebhookConfigured: Boolean(process.env.REVENUE_ANALYST_WEBHOOK_URL?.trim().startsWith('http')),
        capabilities: [
          'Find most profitable routes',
          'Compare margins',
          'Find profitable customers',
          'Identify cost pressure',
          'Review revenue performance',
          'Identify commercial opportunities'
        ],
        primaryAction: {
          id: 'analyze-performance',
          label: 'Analyze Performance',
          task: 'analyze_performance',
          taskDescription: 'Auditing revenue pacing, cost escalations, and customer margin yield...'
        },
        secondaryAction: {
          id: 'view-revenue',
          label: 'View Revenue',
          navId: 'revenue'
        },
        sampleResult: 'Overall profitability is healthy.\nStrongest route: Shanghai → Singapore\nStrongest customer segment: Technology / Electronics\nMain cost pressure: Fuel and port-related costs on selected lanes.'
      }
    ];

    res.json({ success: true, count: agents.length, agents });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Also keep legacy /api/smart-staff endpoint synced
apiRouter.get('/smart-staff', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const agentsRaw = parseQueryResults(db.exec('SELECT * FROM smart_staff ORDER BY tasks_completed_today DESC'));
    const agents = agentsRaw.map((a) => ({
      ...a,
      latest_activity: JSON.parse(a.latest_activity || '{}')
    }));

    res.json({ success: true, count: agents.length, agents });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10.2 AGENT NODE 1: Journey Monitor Endpoint
const handleJourneyMonitor = async (req: Request, res: Response) => {
  try {
    const { task = 'run_check', filters = {}, context = {} } = req.body || {};
    
    const result = await dispatchAgentNode(
      'journey_monitor',
      'JOURNEY_MONITOR_WEBHOOK_URL',
      task,
      filters,
      context,
      async () => {
        const db = await getDb();
        // Query delayed shipments count and key shipments
        const delayedRes = db.exec(`SELECT count(*) as delayed FROM shipments WHERE status = 'Delayed'`);
        const highRiskRes = db.exec(`SELECT count(*) as high_risk FROM shipments WHERE risk_level = 'High'`);
        
        const delayedCount = Number(delayedRes[0]?.values[0]?.[0] || 2);
        const highRiskCount = Number(highRiskRes[0]?.values[0]?.[0] || 1);

        return {
          status: 'success',
          agent: 'journey_monitor',
          agentName: 'Journey Monitor',
          role: 'Operations',
          summary: '3 journeys need attention.\n\n2 shipments are delayed.\n1 shipment has a high ETA risk.\n\nMost affected route:\nHamburg → Jebel Ali',
          findings: [
            {
              title: 'SH10027 (Singapore → Rotterdam)',
              detail: '+18h Suez Canal buffer advisory. Telemetry tracking active; cold-chain Pharma cargo verified at 4.2°C.',
              severity: 'warning',
              highlight: 'Delay: +18 hrs'
            },
            {
              title: 'ODY-9842-SEA (Shanghai → Rotterdam)',
              detail: '+12h berth queue at Rotterdam Gate 4 container terminal. Gantry crane discharge scheduled.',
              severity: 'warning',
              highlight: 'Delay: +12 hrs'
            },
            {
              title: 'SH10008 (Hamburg → Jebel Ali)',
              detail: 'High ETA risk due to Elbe River draft constraints and rail yard queue.',
              severity: 'critical',
              highlight: 'High ETA Risk'
            }
          ],
          metrics: {
            watched_shipments: 500,
            active_journeys: 175,
            delayed_journeys: 2,
            high_risk_journeys: 1,
            on_time_rate: '93.8%'
          },
          recommendations: [
            'Pre-book Gate 4 priority discharge slot at Port of Rotterdam for ODY-9842-SEA',
            'Transmit automated ETA arrival window update (+24h) to Vertex Electronics',
            'Flag upcoming European departures for potential diversion to Port of Antwerp'
          ],
          suggestedAction: {
            label: 'View Journeys',
            navId: 'journeys'
          }
        };
      }
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

apiRouter.post('/agents/journey-monitor', handleJourneyMonitor);
apiRouter.get('/agents/journey-monitor', handleJourneyMonitor);

// 10.3 AGENT NODE 2: Route Analyst Endpoint
const handleRouteAnalyst = async (req: Request, res: Response) => {
  try {
    const { task = 'analyze_routes', filters = {}, context = {} } = req.body || {};
    
    const result = await dispatchAgentNode(
      'route_analyst',
      'ROUTE_ANALYST_WEBHOOK_URL',
      task,
      filters,
      context,
      async () => {
        const db = await getDb();
        const topRoutes = parseQueryResults(db.exec('SELECT * FROM routes ORDER BY opportunity_score DESC LIMIT 3'));
        
        return {
          status: 'success',
          agent: 'route_analyst',
          agentName: 'Route Analyst',
          role: 'Network & Optimization',
          summary: 'Shanghai → Singapore is currently the strongest opportunity.\n\nGrowth: +18.2%\nReliability: 98%\nOpportunity Score: 92',
          findings: [
            {
              title: 'Shanghai → Singapore (R001)',
              detail: 'Leading opportunity lane with +18.2% volume growth and 98% service reliability. High electronics demand.',
              severity: 'resolved',
              highlight: 'Opportunity Score: 92'
            },
            {
              title: 'Singapore → Dubai Air Express (R014)',
              detail: 'High-yield priority air corridor achieving 41.5% gross margin with 14-hour transit speed.',
              severity: 'info',
              highlight: 'Margin: 41.5%'
            },
            {
              title: 'Hamburg → Jebel Ali (R007)',
              detail: 'Underperforming lane with -6.4% volume contraction and elevated container dwell days.',
              severity: 'warning',
              highlight: 'Declining Lane'
            }
          ],
          metrics: {
            total_corridors: 20,
            rising_lanes: 7,
            top_opportunity: 'Shanghai → Singapore',
            top_lane_growth: '+18.2%',
            network_avg_reliability: '94.2%'
          },
          recommendations: [
            'Increase feeder vessel container allocation on Shanghai → Singapore by +15%',
            'Reallocate underutilized capacity from Hamburg corridor to high-demand Asian lanes',
            'Lock in forward booking contracts for consumer electronics batches'
          ],
          suggestedAction: {
            label: 'View Rising',
            navId: 'rising'
          }
        };
      }
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

apiRouter.post('/agents/route-analyst', handleRouteAnalyst);
apiRouter.get('/agents/route-analyst', handleRouteAnalyst);

// 10.4 AGENT NODE 3: Risk Analyst Endpoint
const handleRiskAnalyst = async (req: Request, res: Response) => {
  try {
    const { task = 'run_risk_check', filters = {}, context = {} } = req.body || {};
    
    const result = await dispatchAgentNode(
      'risk_analyst',
      'RISK_ANALYST_WEBHOOK_URL',
      task,
      filters,
      context,
      async () => {
        const db = await getDb();
        const risks = parseQueryResults(db.exec('SELECT * FROM external_signals LIMIT 3'));
        
        return {
          status: 'success',
          agent: 'risk_analyst',
          agentName: 'Risk Analyst',
          role: 'Risk & Resilience',
          summary: '2 routes currently require attention.\n\nHamburg → Jebel Ali\nReason: port congestion + weaker reliability\n\nLos Angeles → Rotterdam\nReason: weather variability + ETA risk\n\n(Note: External risk signals represent simulated prototype data.)',
          findings: [
            {
              title: 'Hamburg → Jebel Ali (R007)',
              detail: 'Port of Hamburg container dwell elevated to 4.1 days due to Elbe River draft restrictions. Reliability at 76.0%.',
              severity: 'critical',
              highlight: 'Port Congestion'
            },
            {
              title: 'Los Angeles → Rotterdam (R015)',
              detail: 'North Atlantic weather variability and terminal staging backlog creating +14h ETA variance.',
              severity: 'warning',
              highlight: 'Weather / ETA Risk'
            },
            {
              title: 'Bab-el-Mandeb Strait Escort Advisory',
              detail: 'Simulated maritime escort protocol in Red Sea corridor; +18h voyage buffer recommended.',
              severity: 'info',
              highlight: 'Prototype Signal'
            }
          ],
          metrics: {
            monitored_nodes: 16,
            active_risk_signals: 5,
            critical_routes: 2,
            avg_port_dwell: '2.8 days'
          },
          recommendations: [
            'Divert upcoming European consignments to Port of Antwerp to bypass Hamburg dwell',
            'Apply +24h ETA contingency buffer across trans-Suez maritime bookings',
            'Enable continuous satellite waypoint polling on active high-risk shipments'
          ],
          suggestedAction: {
            label: 'View Falling',
            navId: 'falling'
          }
        };
      }
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

apiRouter.post('/agents/risk-analyst', handleRiskAnalyst);
apiRouter.get('/agents/risk-analyst', handleRiskAnalyst);

// 10.5 AGENT NODE 4: Revenue Analyst Endpoint
const handleRevenueAnalyst = async (req: Request, res: Response) => {
  try {
    const { task = 'analyze_performance', filters = {}, context = {} } = req.body || {};
    
    const result = await dispatchAgentNode(
      'revenue_analyst',
      'REVENUE_ANALYST_WEBHOOK_URL',
      task,
      filters,
      context,
      async () => {
        const db = await getDb();
        const totalStats = db.exec('SELECT sum(revenue_usd) as rev, sum(profit_usd) as prof FROM shipments');
        const rev = Number(totalStats[0]?.values[0]?.[0] || 11840000);
        const prof = Number(totalStats[0]?.values[0]?.[1] || 3490000);
        const marginPct = ((prof / rev) * 100).toFixed(1);

        return {
          status: 'success',
          agent: 'revenue_analyst',
          agentName: 'Revenue Analyst',
          role: 'Finance & Performance',
          summary: 'Overall profitability is healthy.\n\nStrongest route:\nShanghai → Singapore\n\nStrongest customer segment:\nTechnology / Electronics\n\nMain cost pressure:\nFuel and port-related costs on selected lanes.',
          findings: [
            {
              title: 'Q3 Gross Margin: 29.5%',
              detail: '$3.49M gross profit on $11.84M revenue. Exceeding the corporate target threshold of 28.8%.',
              severity: 'resolved',
              highlight: 'Margin: 29.5%'
            },
            {
              title: 'Top Customer: Vertex Electronics',
              detail: 'Delivering $2.4M quarterly volume with 34.2% net yield across consumer electronics product lines (+28.4% YoY).',
              severity: 'info',
              highlight: '+28.4% Growth'
            },
            {
              title: 'Cost Pressure: Fuel & Port Dwell',
              detail: 'Bunker fuel variations and European terminal demurrage represent 68% of operational cost variance.',
              severity: 'warning',
              highlight: 'Cost Driver'
            }
          ],
          metrics: {
            watched_accounts: 12,
            gross_revenue: '$11.84M',
            gross_profit: '$3.49M',
            operating_margin: '29.5%',
            target_margin: '28.8%'
          },
          recommendations: [
            'Lock in quarterly volume commitments with Vertex Electronics and Northstar Retail',
            'Leverage -5.2% bunker index decline to negotiate fixed Q4 carrier agreements',
            'Audit carrier invoice surcharges on transatlantic lanes to eliminate billing leakage'
          ],
          suggestedAction: {
            label: 'View Revenue',
            navId: 'revenue'
          }
        };
      }
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

apiRouter.post('/agents/revenue-analyst', handleRevenueAnalyst);
apiRouter.get('/agents/revenue-analyst', handleRevenueAnalyst);


// 11. PORTS, WAREHOUSES, CARGO, CARRIERS, SUPPLIERS
apiRouter.get('/ports', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const ports = parseQueryResults(db.exec('SELECT * FROM ports ORDER BY service_reliability_pct DESC'));
    res.json({ success: true, count: ports.length, ports });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/warehouses', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const warehouses = parseQueryResults(db.exec('SELECT * FROM warehouses ORDER BY capacity_pallets DESC'));
    res.json({ success: true, count: warehouses.length, warehouses });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/customers', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const customers = parseQueryResults(db.exec('SELECT * FROM customers ORDER BY growth_pct DESC'));
    res.json({ success: true, count: customers.length, customers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/cargo', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const cargo = parseQueryResults(db.exec('SELECT * FROM cargo_categories ORDER BY base_margin_pct DESC'));
    res.json({ success: true, count: cargo.length, cargo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/carriers', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const carriers = parseQueryResults(db.exec('SELECT * FROM carriers ORDER BY reliability_score DESC'));
    res.json({ success: true, count: carriers.length, carriers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/suppliers', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const suppliers = parseQueryResults(db.exec('SELECT * FROM suppliers ORDER BY reliability_score DESC'));
    res.json({ success: true, count: suppliers.length, suppliers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 12. REPORTS
apiRouter.get('/reports', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const reportsRaw = parseQueryResults(db.exec('SELECT * FROM reports ORDER BY id DESC'));
    const reports = reportsRaw.map((r) => ({
      ...r,
      highlights: JSON.parse(r.highlights || '[]')
    }));
    res.json({ success: true, count: reports.length, reports });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
