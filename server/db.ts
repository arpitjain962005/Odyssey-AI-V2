import initSqlJs, { Database } from 'sql.js';
import {
  UNIFIED_MASTER_DATA,
  MasterPort,
  MasterWarehouse,
  MasterCustomer,
  MasterCargo,
  MasterCarrier,
  MasterSupplier,
  MasterRoute,
  MasterShipment,
  MasterContainer,
  MasterOrder,
  MasterOperationalEvent,
  MasterExternalSignal,
  MasterTarget,
  MasterSmartStaffAgent
} from '../src/data/masterDataset';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();
  db = new SQL.Database();

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;');

  // Create Schema
  createTables(db);
  seedDatabase(db);

  return db;
}

function createTables(database: Database) {
  database.run(`
    -- 1. Ports (16 Master Ports)
    CREATE TABLE IF NOT EXISTS ports (
      port_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      region TEXT NOT NULL,
      congestion TEXT NOT NULL,
      avg_vessel_wait_hours REAL NOT NULL,
      avg_container_dwell_days REAL NOT NULL,
      service_reliability_pct REAL NOT NULL,
      yard_utilization_pct INTEGER NOT NULL,
      status TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      coord_x REAL NOT NULL,
      coord_y REAL NOT NULL,
      notes TEXT NOT NULL
    );

    -- 2. Warehouses (8 Master Warehouses)
    CREATE TABLE IF NOT EXISTS warehouses (
      warehouse_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      capacity_pallets INTEGER NOT NULL,
      utilization_pct INTEGER NOT NULL,
      status TEXT NOT NULL,
      region TEXT NOT NULL,
      country TEXT NOT NULL
    );

    -- 3. Customers (12 Master Customers)
    CREATE TABLE IF NOT EXISTS customers (
      customer_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      industry TEXT NOT NULL,
      country TEXT NOT NULL,
      region TEXT NOT NULL,
      tier TEXT NOT NULL,
      account_owner TEXT NOT NULL,
      growth TEXT NOT NULL,
      growth_pct REAL NOT NULL
    );

    -- 4. Cargo Categories (12 Master Categories)
    CREATE TABLE IF NOT EXISTS cargo_categories (
      cargo_id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      is_high_margin INTEGER NOT NULL,
      base_margin_pct REAL NOT NULL,
      growth_pct REAL NOT NULL,
      demand_signal TEXT NOT NULL,
      demand_drivers TEXT NOT NULL
    );

    -- 5. Carriers (8 Master Carriers)
    CREATE TABLE IF NOT EXISTS carriers (
      carrier_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mode TEXT NOT NULL,
      coverage TEXT NOT NULL,
      reliability_score REAL NOT NULL
    );

    -- 6. Suppliers (8 Master Suppliers)
    CREATE TABLE IF NOT EXISTS suppliers (
      supplier_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      country TEXT NOT NULL,
      region TEXT NOT NULL,
      reliability_score REAL NOT NULL
    );

    -- 7. Core Routes (20 Master Routes)
    CREATE TABLE IF NOT EXISTS routes (
      route_id TEXT PRIMARY KEY,
      origin_port_id TEXT NOT NULL,
      origin_name TEXT NOT NULL,
      dest_port_id TEXT NOT NULL,
      dest_name TEXT NOT NULL,
      transit_days INTEGER NOT NULL,
      freight_baseline_usd REAL NOT NULL,
      operating_cost_baseline_usd REAL NOT NULL,
      growth_pct REAL NOT NULL,
      reliability_pct REAL NOT NULL,
      opportunity_score INTEGER NOT NULL,
      signal TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      mode TEXT NOT NULL
    );

    -- 8. Shipments (500 Deterministic Shipments)
    CREATE TABLE IF NOT EXISTS shipments (
      shipment_id TEXT PRIMARY KEY,
      route_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      cargo_id TEXT NOT NULL,
      supplier_id TEXT NOT NULL,
      carrier_id TEXT NOT NULL,
      mode TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      etd TEXT NOT NULL,
      planned_eta TEXT NOT NULL,
      actual_delivery TEXT,
      status TEXT NOT NULL,
      teu INTEGER NOT NULL,
      weight_tonnes REAL NOT NULL,
      freight_usd REAL NOT NULL,
      fuel_surcharge_usd REAL NOT NULL,
      handling_usd REAL NOT NULL,
      customs_usd REAL NOT NULL,
      labor_usd REAL NOT NULL,
      insurance_usd REAL NOT NULL,
      other_cost_usd REAL NOT NULL,
      total_cost_usd REAL NOT NULL,
      revenue_usd REAL NOT NULL,
      profit_usd REAL NOT NULL,
      margin_pct REAL NOT NULL,
      delay_hours INTEGER NOT NULL,
      risk_level TEXT NOT NULL,
      FOREIGN KEY (route_id) REFERENCES routes(route_id),
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
      FOREIGN KEY (cargo_id) REFERENCES cargo_categories(cargo_id),
      FOREIGN KEY (carrier_id) REFERENCES carriers(carrier_id),
      FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
    );

    -- 9. Containers (~1,100 Master Containers)
    CREATE TABLE IF NOT EXISTS containers (
      container_id TEXT PRIMARY KEY,
      shipment_id TEXT NOT NULL,
      route_id TEXT NOT NULL,
      size TEXT NOT NULL,
      temperature_class TEXT NOT NULL,
      weight_tonnes REAL NOT NULL,
      load_type TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (shipment_id) REFERENCES shipments(shipment_id) ON DELETE CASCADE
    );

    -- 10. Orders (500 Master Orders)
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      shipment_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      cargo_id TEXT NOT NULL,
      units INTEGER NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      FOREIGN KEY (shipment_id) REFERENCES shipments(shipment_id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
      FOREIGN KEY (cargo_id) REFERENCES cargo_categories(cargo_id)
    );

    -- 11. Operational Events (900 Master Events)
    CREATE TABLE IF NOT EXISTS operational_events (
      event_id TEXT PRIMARY KEY,
      shipment_id TEXT NOT NULL,
      route_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      severity TEXT NOT NULL,
      location TEXT NOT NULL,
      FOREIGN KEY (shipment_id) REFERENCES shipments(shipment_id) ON DELETE CASCADE
    );

    -- 12. External Signals (10-15 Signals)
    CREATE TABLE IF NOT EXISTS external_signals (
      signal_id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      impact_level TEXT NOT NULL,
      trend TEXT NOT NULL,
      description TEXT NOT NULL,
      detected_date TEXT NOT NULL
    );

    -- 13. Targets & SLA (8 Master Targets)
    CREATE TABLE IF NOT EXISTS targets (
      id TEXT PRIMARY KEY,
      metric TEXT NOT NULL,
      target_value REAL NOT NULL,
      current_value REAL NOT NULL,
      formatted_target TEXT NOT NULL,
      formatted_current TEXT NOT NULL,
      unit TEXT NOT NULL,
      status TEXT NOT NULL,
      category TEXT NOT NULL,
      quarter TEXT NOT NULL
    );

    -- 14. Smart Staff Agents (5 AI Agents)
    CREATE TABLE IF NOT EXISTS smart_staff (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      purpose TEXT NOT NULL,
      status TEXT NOT NULL,
      coverage TEXT NOT NULL,
      specialty TEXT NOT NULL,
      avatar_icon TEXT NOT NULL,
      tasks_completed_today INTEGER NOT NULL,
      accuracy_rate TEXT NOT NULL,
      latency TEXT NOT NULL,
      cost_saved_week TEXT NOT NULL,
      reroutes_executed INTEGER NOT NULL,
      latest_activity TEXT NOT NULL -- JSON string
    );

    -- 15. Financial Records & Trends
    CREATE TABLE IF NOT EXISTS financial_records (
      id TEXT PRIMARY KEY,
      period TEXT NOT NULL,
      label TEXT NOT NULL,
      revenue REAL NOT NULL,
      profit REAL NOT NULL,
      margin REAL NOT NULL,
      cost REAL NOT NULL
    );

    -- 16. Cost Categories
    CREATE TABLE IF NOT EXISTS cost_categories (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      percentage REAL NOT NULL,
      color TEXT NOT NULL,
      trend TEXT NOT NULL,
      is_saving_target INTEGER NOT NULL DEFAULT 0
    );

    -- 17. Cost Escalations
    CREATE TABLE IF NOT EXISTS cost_escalations (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      corridor TEXT NOT NULL,
      current_variance TEXT NOT NULL,
      projected_overrun TEXT NOT NULL,
      driver TEXT NOT NULL,
      status TEXT NOT NULL
    );

    -- 18. Journeys for interactive maps and journey views
    CREATE TABLE IF NOT EXISTS journeys (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      mode TEXT NOT NULL,
      status TEXT NOT NULL,
      carrier TEXT NOT NULL,
      vessel_flight TEXT,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      origin_lat REAL NOT NULL,
      origin_lng REAL NOT NULL,
      dest_lat REAL NOT NULL,
      dest_lng REAL NOT NULL,
      current_lat REAL NOT NULL,
      current_lng REAL NOT NULL,
      progress_percent INTEGER NOT NULL,
      containers_count INTEGER NOT NULL,
      container_numbers TEXT NOT NULL,
      distance_remaining TEXT NOT NULL,
      eta TEXT NOT NULL,
      eta_variance TEXT,
      last_updated TEXT NOT NULL,
      departure_date TEXT NOT NULL,
      route_id TEXT,
      delay_reason TEXT,
      recommendation TEXT,
      risk_summary TEXT,
      suggested_actions TEXT,
      weather_alert TEXT,
      map_overlay_type TEXT,
      map_overlay_message TEXT,
      map_overlay_lat REAL,
      map_overlay_lng REAL
    );

    CREATE TABLE IF NOT EXISTS journey_stops (
      id TEXT PRIMARY KEY,
      journey_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      status TEXT NOT NULL,
      scheduled_time TEXT NOT NULL,
      actual_time TEXT,
      note TEXT,
      stop_order INTEGER NOT NULL,
      FOREIGN KEY (journey_id) REFERENCES journeys(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS journey_documents (
      id TEXT PRIMARY KEY,
      journey_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      size TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (journey_id) REFERENCES journeys(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS journey_activities (
      id TEXT PRIMARY KEY,
      journey_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL,
      location TEXT,
      FOREIGN KEY (journey_id) REFERENCES journeys(id) ON DELETE CASCADE
    );

    -- 19. Reports
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      generated_date TEXT NOT NULL,
      file_size TEXT NOT NULL,
      read_time TEXT NOT NULL,
      key_takeaway TEXT NOT NULL,
      content_snippet TEXT NOT NULL,
      highlights TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);
}

function seedDatabase(database: Database) {
  const data = UNIFIED_MASTER_DATA;

  // 1. Ports
  for (const p of data.ports) {
    database.run(
      `INSERT INTO ports (port_id, name, country, region, congestion, avg_vessel_wait_hours, avg_container_dwell_days, service_reliability_pct, yard_utilization_pct, status, lat, lng, coord_x, coord_y, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.port_id, p.name, p.country, p.region, p.congestion, p.avg_vessel_wait_hours, p.avg_container_dwell_days, p.service_reliability_pct, p.yard_utilization_pct, p.status, p.lat, p.lng, p.coord_x, p.coord_y, p.notes]
    );
  }

  // 2. Warehouses
  for (const w of data.warehouses) {
    database.run(
      `INSERT INTO warehouses (warehouse_id, name, capacity_pallets, utilization_pct, status, region, country)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [w.warehouse_id, w.name, w.capacity_pallets, w.utilization_pct, w.status, w.region, w.country]
    );
  }

  // 3. Customers
  for (const c of data.customers) {
    database.run(
      `INSERT INTO customers (customer_id, name, industry, country, region, tier, account_owner, growth, growth_pct)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.customer_id, c.name, c.industry, c.country, c.region, c.tier, c.account_owner, c.growth, c.growth_pct]
    );
  }

  // 4. Cargo
  for (const g of data.cargo) {
    database.run(
      `INSERT INTO cargo_categories (cargo_id, category, is_high_margin, base_margin_pct, growth_pct, demand_signal, demand_drivers)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [g.cargo_id, g.category, g.is_high_margin ? 1 : 0, g.base_margin_pct, g.growth_pct, g.demand_signal, g.demand_drivers]
    );
  }

  // 5. Carriers
  for (const car of data.carriers) {
    database.run(
      `INSERT INTO carriers (carrier_id, name, mode, coverage, reliability_score)
       VALUES (?, ?, ?, ?, ?)`,
      [car.carrier_id, car.name, car.mode, car.coverage, car.reliability_score]
    );
  }

  // 6. Suppliers
  for (const s of data.suppliers) {
    database.run(
      `INSERT INTO suppliers (supplier_id, name, category, country, region, reliability_score)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [s.supplier_id, s.name, s.category, s.country, s.region, s.reliability_score]
    );
  }

  // 7. Routes
  for (const r of data.routes) {
    database.run(
      `INSERT INTO routes (route_id, origin_port_id, origin_name, dest_port_id, dest_name, transit_days, freight_baseline_usd, operating_cost_baseline_usd, growth_pct, reliability_pct, opportunity_score, signal, risk_level, mode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.route_id, r.origin_port_id, r.origin_name, r.dest_port_id, r.dest_name, r.transit_days, r.freight_baseline_usd, r.operating_cost_baseline_usd, r.growth_pct, r.reliability_pct, r.opportunity_score, r.signal, r.risk_level, r.mode]
    );
  }

  // 8. Shipments (500)
  for (const sh of data.shipments) {
    database.run(
      `INSERT INTO shipments (shipment_id, route_id, customer_id, cargo_id, supplier_id, carrier_id, mode, booking_date, etd, planned_eta, actual_delivery, status, teu, weight_tonnes, freight_usd, fuel_surcharge_usd, handling_usd, customs_usd, labor_usd, insurance_usd, other_cost_usd, total_cost_usd, revenue_usd, profit_usd, margin_pct, delay_hours, risk_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sh.shipment_id, sh.route_id, sh.customer_id, sh.cargo_id, sh.supplier_id, sh.carrier_id, sh.mode, sh.booking_date, sh.etd, sh.planned_eta, sh.actual_delivery, sh.status, sh.teu, sh.weight_tonnes, sh.freight_usd, sh.fuel_surcharge_usd, sh.handling_usd, sh.customs_usd, sh.labor_usd, sh.insurance_usd, sh.other_cost_usd, sh.total_cost_usd, sh.revenue_usd, sh.profit_usd, sh.margin_pct, sh.delay_hours, sh.risk_level]
    );
  }

  // 9. Containers
  for (const cnt of data.containers) {
    database.run(
      `INSERT INTO containers (container_id, shipment_id, route_id, size, temperature_class, weight_tonnes, load_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [cnt.container_id, cnt.shipment_id, cnt.route_id, cnt.size, cnt.temperature_class, cnt.weight_tonnes, cnt.load_type, cnt.status]
    );
  }

  // 10. Orders
  for (const ord of data.orders) {
    database.run(
      `INSERT INTO orders (order_id, shipment_id, customer_id, cargo_id, units, status, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ord.order_id, ord.shipment_id, ord.customer_id, ord.cargo_id, ord.units, ord.status, ord.priority]
    );
  }

  // 11. Events
  for (const ev of data.events) {
    database.run(
      `INSERT INTO operational_events (event_id, shipment_id, route_id, event_type, title, description, timestamp, severity, location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ev.event_id, ev.shipment_id, ev.route_id, ev.event_type, ev.title, ev.description, ev.timestamp, ev.severity, ev.location]
    );
  }

  // 12. External Signals
  for (const sig of data.externalSignals) {
    database.run(
      `INSERT INTO external_signals (signal_id, category, title, location, impact_level, trend, description, detected_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [sig.signal_id, sig.category, sig.title, sig.location, sig.impact_level, sig.trend, sig.description, sig.detected_date]
    );
  }

  // 13. Targets
  for (const tgt of data.targets) {
    database.run(
      `INSERT INTO targets (id, metric, target_value, current_value, formatted_target, formatted_current, unit, status, category, quarter)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tgt.id, tgt.metric, tgt.target_value, tgt.current_value, tgt.formatted_target, tgt.formatted_current, tgt.unit, tgt.status, tgt.category, tgt.quarter]
    );
  }

  // 14. Smart Staff
  for (const ag of data.smartStaff) {
    database.run(
      `INSERT INTO smart_staff (id, name, role, purpose, status, coverage, specialty, avatar_icon, tasks_completed_today, accuracy_rate, latency, cost_saved_week, reroutes_executed, latest_activity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ag.id, ag.name, ag.role, ag.purpose, ag.status, ag.coverage, ag.specialty, ag.avatar_icon, ag.tasks_completed_today, ag.accuracy_rate, ag.latency, ag.cost_saved_week, ag.reroutes_executed, JSON.stringify(ag.latest_activity)]
    );
  }

  // 15. Financial Records (Monthly and aggregated)
  const monthlyFin = [
    { id: 'fin-jun-26', period: '2026-06', label: 'June 2026', revenue: 3.82, profit: 1.12, margin: 29.3, cost: 2.70 },
    { id: 'fin-jul-26', period: '2026-07', label: 'July 2026', revenue: 4.16, profit: 1.22, margin: 29.3, cost: 2.94 },
    { id: 'fin-aug-26', period: '2026-08', label: 'August 2026 (MTD)', revenue: 3.86, profit: 1.15, margin: 29.8, cost: 2.71 }
  ];
  for (const f of monthlyFin) {
    database.run(
      `INSERT INTO financial_records (id, period, label, revenue, profit, margin, cost)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [f.id, f.period, f.label, f.revenue, f.profit, f.margin, f.cost]
    );
  }

  // 16. Cost Categories
  const costCats = [
    { id: 'c1', category: 'Ocean & Air Freight Base', amount: 4.28, percentage: 51.2, color: '#3B82F6', trend: '-2.4% carrier contract renegotiation', is_saving_target: 0 },
    { id: 'c2', category: 'Fuel & Bunkering (VLSFO)', amount: 1.02, percentage: 12.2, color: '#F43F5E', trend: '-5.2% index drop to $545/MT', is_saving_target: 1 },
    { id: 'c3', category: 'Handling & Stevedoring', amount: 0.94, percentage: 11.2, color: '#F59E0B', trend: 'Yard automation efficiency', is_saving_target: 0 },
    { id: 'c4', category: 'Customs Clearance & Duties', amount: 0.82, percentage: 9.8, color: '#8B5CF6', trend: 'Digital pre-clearance saving', is_saving_target: 0 },
    { id: 'c5', category: 'Labor & Fleet Ops', amount: 0.74, percentage: 8.9, color: '#10B981', trend: '-3.8% shift optimization', is_saving_target: 1 },
    { id: 'c6', category: 'Insurance & Contingency', amount: 0.55, percentage: 6.7, color: '#64748B', trend: 'Low loss ratio premium discount', is_saving_target: 0 }
  ];
  for (const c of costCats) {
    database.run(
      `INSERT INTO cost_categories (id, category, amount, percentage, color, trend, is_saving_target)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.category, c.amount, c.percentage, c.color, c.trend, c.is_saving_target]
    );
  }

  // 17. Cost Escalations
  const escalations = [
    { id: 'esc-1', category: 'Port Demurrage & Dwell', corridor: 'Hamburg (P010) → Jebel Ali (R007)', current_variance: '+18.4%', projected_overrun: '$48,500', driver: 'Elbe shallow draft & rail yard queue', status: 'Critical' },
    { id: 'esc-2', category: 'Vessel Waiting Cost', corridor: 'Los Angeles (P005) → Rotterdam (R015)', current_variance: '+12.6%', projected_overrun: '$34,200', driver: 'Berth 4 crane maintenance backlog', status: 'Warning' },
    { id: 'esc-3', category: 'Cold-Chain Re-icing', corridor: 'Santos (P011) → Jebel Ali (R020)', current_variance: '+8.2%', projected_overrun: '$19,800', driver: 'Ambient equatorial transit heat buffer', status: 'Moderate' }
  ];
  for (const e of escalations) {
    database.run(
      `INSERT INTO cost_escalations (id, category, corridor, current_variance, projected_overrun, driver, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [e.id, e.category, e.corridor, e.current_variance, e.projected_overrun, e.driver, e.status]
    );
  }

  // 18. Journeys (Key representative active journeys including SH10027)
  const journeySeeds = [
    {
      id: 'SH10027',
      title: 'Singapore → Rotterdam Transoceanic Express',
      mode: 'sea',
      status: 'delayed',
      carrier: 'Maersk Line',
      vessel_flight: 'Vessel: Eleanor Maersk (IMO 9321483)',
      origin: 'Port of Singapore (P002)',
      destination: 'Port of Rotterdam (P003)',
      origin_lat: 58,
      origin_lng: 74,
      dest_lat: 32,
      dest_lng: 50,
      current_lat: 42,
      current_lng: 58,
      progress_percent: 64,
      containers_count: 4,
      container_numbers: JSON.stringify(['CONT100027', 'CONT100028', 'CONT100029', 'CONT100030']),
      distance_remaining: '1,840 nautical miles',
      eta: 'Aug 7, 2026 • 14:00 GMT',
      eta_variance: '+18h canal buffer',
      last_updated: '4 mins ago via Satellite AIS',
      departure_date: 'Jul 15, 2026',
      route_id: 'R002',
      delay_reason: 'Suez Canal transit convoy queue buffer +18 hours.',
      recommendation: 'Pre-book Gate 4 priority discharge slot at Rotterdam.',
      risk_summary: 'Medium operational risk; cold-chain telemetry normal.',
      suggested_actions: JSON.stringify(['Notify Vertex Electronics', 'Reserve Berth 4 Express Crane', 'Dispatch Inland Rail']),
      weather_alert: 'Mild swell advisory in North Red Sea; sea speed at 18.4 knots.',
      map_overlay_type: 'canal_congestion',
      map_overlay_message: 'Convoy slot allocated; ETA locked.',
      map_overlay_lat: 30.5,
      map_overlay_lng: 32.3
    },
    {
      id: 'ODY-9842-SEA',
      title: 'Shanghai → Rotterdam Transoceanic Route',
      mode: 'sea',
      status: 'delayed',
      carrier: 'Maersk Line',
      vessel_flight: 'Vessel: Eleanor Maersk (IMO 9321483)',
      origin: 'Port of Shanghai (P001)',
      destination: 'Port of Rotterdam (P003)',
      origin_lat: 44,
      origin_lng: 78,
      dest_lat: 32,
      dest_lng: 50,
      current_lat: 40,
      current_lng: 60,
      progress_percent: 62,
      containers_count: 12,
      container_numbers: JSON.stringify(['MSCU849201', 'MSCU849202', 'MAEU391048', 'MAEU391049']),
      distance_remaining: '1,920 nautical miles',
      eta: 'Aug 6, 2026 • 18:00 GMT',
      eta_variance: '+12h delay',
      last_updated: '6 mins ago via Satellite AIS',
      departure_date: 'Jul 18, 2026',
      route_id: 'R004',
      delay_reason: 'Berth 4 crane maintenance backlog at Rotterdam Port.',
      recommendation: 'Request auxiliary berth discharge at Antwerp.',
      risk_summary: 'Critical SLA target for Northstar Retail.',
      suggested_actions: JSON.stringify(['Notify Logistics Team', 'Request Antwerp Feeder', 'Reroute Truck Fleet']),
      weather_alert: 'Clear weather on Atlantic approach.',
      map_overlay_type: 'port_congestion',
      map_overlay_message: 'Gate 4 berth queue +12h delay',
      map_overlay_lat: 51.92,
      map_overlay_lng: 4.47
    },
    {
      id: 'ODY-5298-SEA',
      title: 'Shanghai → Singapore High-Yield Feeder',
      mode: 'sea',
      status: 'active',
      carrier: 'ONE Ocean Network',
      vessel_flight: 'Vessel: ONE Apus (IMO 9806079)',
      origin: 'Port of Shanghai (P001)',
      destination: 'Port of Singapore (P002)',
      origin_lat: 44,
      origin_lng: 78,
      dest_lat: 58,
      dest_lng: 74,
      current_lat: 51,
      current_lng: 76,
      progress_percent: 78,
      containers_count: 8,
      container_numbers: JSON.stringify(['ONEY748291', 'ONEY748292', 'ONEY748293']),
      distance_remaining: '420 nautical miles',
      eta: 'Aug 15, 2026 • 06:00 GMT',
      eta_variance: 'On Schedule (-1h)',
      last_updated: '2 mins ago via Satellite AIS',
      departure_date: 'Aug 10, 2026',
      route_id: 'R001',
      delay_reason: 'None. Smooth passage through Taiwan Strait.',
      recommendation: 'Direct transfer to Tuas automated transshipment crane.',
      risk_summary: 'Optimal transit conditions; 98.4% reliability.',
      suggested_actions: JSON.stringify(['Confirm Feeder Transfer', 'Notify BluePeak Commerce']),
      weather_alert: 'Calm seas (Beaufort 2).',
      map_overlay_type: 'smooth_passage',
      map_overlay_message: 'Green wave berth allocated',
      map_overlay_lat: 1.35,
      map_overlay_lng: 103.8
    },
    {
      id: 'ODY-1044-AIR',
      title: 'Singapore → Dubai Priority Air Express',
      mode: 'air',
      status: 'active',
      carrier: 'Emirates SkyCargo',
      vessel_flight: 'Flight: EK9924 (Boeing 777F)',
      origin: 'Singapore Changi (P002)',
      destination: 'Dubai Al Maktoum (P012)',
      origin_lat: 58,
      origin_lng: 74,
      dest_lat: 45,
      dest_lng: 63,
      current_lat: 50,
      current_lng: 68,
      progress_percent: 45,
      containers_count: 4,
      container_numbers: JSON.stringify(['EKULD19482', 'EKULD19483']),
      distance_remaining: '1,650 miles',
      eta: 'Aug 14, 2026 • 21:30 GMT',
      eta_variance: 'On Schedule',
      last_updated: '1 min ago via ADS-B',
      departure_date: 'Aug 14, 2026',
      route_id: 'R014',
      delay_reason: 'None.',
      recommendation: 'Pre-clear cold chain customs for Helix Medical cargo.',
      risk_summary: 'Active temperature logging within 2.0°C – 8.0°C.',
      suggested_actions: JSON.stringify(['Confirm Airport Ground Handling', 'Send Temperature Certificate']),
      weather_alert: 'Clear flight path.',
      map_overlay_type: 'flight_optimal',
      map_overlay_message: 'Direct oceanic waypoint clearance',
      map_overlay_lat: 25.2,
      map_overlay_lng: 55.27
    }
  ];

  for (const j of journeySeeds) {
    database.run(
      `INSERT INTO journeys (id, title, mode, status, carrier, vessel_flight, origin, destination, origin_lat, origin_lng, dest_lat, dest_lng, current_lat, current_lng, progress_percent, containers_count, container_numbers, distance_remaining, eta, eta_variance, last_updated, departure_date, route_id, delay_reason, recommendation, risk_summary, suggested_actions, weather_alert, map_overlay_type, map_overlay_message, map_overlay_lat, map_overlay_lng)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [j.id, j.title, j.mode, j.status, j.carrier, j.vessel_flight, j.origin, j.destination, j.origin_lat, j.origin_lng, j.dest_lat, j.dest_lng, j.current_lat, j.current_lng, j.progress_percent, j.containers_count, j.container_numbers, j.distance_remaining, j.eta, j.eta_variance, j.last_updated, j.departure_date, j.route_id, j.delay_reason, j.recommendation, j.risk_summary, j.suggested_actions, j.weather_alert, j.map_overlay_type, j.map_overlay_message, j.map_overlay_lat, j.map_overlay_lng]
    );

    // Stops for SH10027 and ODY-9842-SEA
    const stops = [
      { id: `${j.id}-s1`, journey_id: j.id, name: 'Origin Consolidation', type: 'warehouse', location: j.origin, lat: j.origin_lat, lng: j.origin_lng, status: 'completed', scheduled_time: 'Jul 15, 08:00 GMT', actual_time: 'Jul 15, 08:15 GMT', note: 'Containers loaded & sealed', stop_order: 1 },
      { id: `${j.id}-s2`, journey_id: j.id, name: 'Port Quay Departure', type: 'port', location: j.origin, lat: j.origin_lat, lng: j.origin_lng, status: 'completed', scheduled_time: 'Jul 16, 04:00 GMT', actual_time: 'Jul 16, 05:10 GMT', note: 'Vessel departure logged', stop_order: 2 },
      { id: `${j.id}-s3`, journey_id: j.id, name: 'Maritime Waypoint', type: 'ocean', location: 'Indian Ocean Corridor', lat: j.current_lat, lng: j.current_lng, status: 'in_progress', scheduled_time: 'Jul 20 - Aug 02', actual_time: 'In Transit (18.4 kts)', note: 'AIS tracked', stop_order: 3 },
      { id: `${j.id}-s4`, journey_id: j.id, name: 'Destination Port Berth', type: 'port', location: j.destination, lat: j.dest_lat, lng: j.dest_lng, status: 'upcoming', scheduled_time: j.eta, actual_time: null, note: 'Berth discharge booked', stop_order: 4 }
    ];

    for (const st of stops) {
      database.run(
        `INSERT INTO journey_stops (id, journey_id, name, type, location, lat, lng, status, scheduled_time, actual_time, note, stop_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [st.id, st.journey_id, st.name, st.type, st.location, st.lat, st.lng, st.status, st.scheduled_time, st.actual_time, st.note, st.stop_order]
      );
    }

    // Documents
    const docs = [
      { id: `${j.id}-d1`, journey_id: j.id, name: `Bill_of_Lading_${j.id}.pdf`, type: 'pdf', size: '2.4 MB', date: 'Jul 15, 2026' },
      { id: `${j.id}-d2`, journey_id: j.id, name: `Customs_Declaration_${j.id}.pdf`, type: 'pdf', size: '1.2 MB', date: 'Jul 15, 2026' }
    ];
    for (const d of docs) {
      database.run(
        `INSERT INTO journey_documents (id, journey_id, name, type, size, date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [d.id, d.journey_id, d.name, d.type, d.size, d.date]
      );
    }

    // Activities
    const activities = [
      { id: `${j.id}-a1`, journey_id: j.id, timestamp: '10 mins ago', title: 'Telemetry Ping Received', description: 'Satellite beacon reported 18.4 knots cruising speed.', severity: 'info', location: 'Indian Ocean' },
      { id: `${j.id}-a2`, journey_id: j.id, timestamp: '2 hours ago', title: 'ETA Synchronized', description: `Journey Monitor locked arrival window to ${j.eta}.`, severity: 'info', location: 'Network Hub' }
    ];
    for (const a of activities) {
      database.run(
        `INSERT INTO journey_activities (id, journey_id, timestamp, title, description, severity, location)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [a.id, a.journey_id, a.timestamp, a.title, a.description, a.severity, a.location]
      );
    }
  }

  // 19. Reports
  const reports = [
    {
      id: 'rep-q3-pulse',
      title: 'Q3 Global Logistics Pulse Briefing',
      category: 'Executive Summary',
      author: 'Odyssey AI Intelligence Hub',
      generated_date: 'August 14, 2026',
      file_size: '3.4 MB',
      read_time: '4 min read',
      key_takeaway: 'Gross revenue pacing at $11.84M with 29.5% gross margin. Shanghai → Singapore and Transpacific lanes driving outperformance.',
      content_snippet: 'Comprehensive executive analysis across 500 active consignments, 20 global corridors, and 16 tier-one container gateways.',
      highlights: JSON.stringify(['$11.84M Q3 Revenue on track towards $12.5M target', 'Shanghai → Singapore leads Rising leaderboard (+18.2% YoY)', 'Hamburg port dwell mitigation active; Antwerp alternate berth deployed']),
      status: 'Published'
    },
    {
      id: 'rep-route-yield',
      title: 'Corridor Profitability & Expansion Audit',
      category: 'Route Intelligence',
      author: 'Route Analyst Agent',
      generated_date: 'August 12, 2026',
      file_size: '2.8 MB',
      read_time: '6 min read',
      key_takeaway: 'High-tech electronics and medical cargo generating 36.8% margin; feeder allocation recommended for Shanghai → Singapore.',
      content_snippet: 'Cross-lane margin comparison ranking all 20 trade corridors against historical baseline freight tariffs.',
      highlights: JSON.stringify(['Vertex Electronics #1 account contributor', 'Medical Equipment high-margin priority yields +42.0% gross margin', 'Red Sea detour buffer absorbing +18h voyage time']),
      status: 'Published'
    }
  ];

  for (const rep of reports) {
    database.run(
      `INSERT INTO reports (id, title, category, author, generated_date, file_size, read_time, key_takeaway, content_snippet, highlights, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [rep.id, rep.title, rep.category, rep.author, rep.generated_date, rep.file_size, rep.read_time, rep.key_takeaway, rep.content_snippet, rep.highlights, rep.status]
    );
  }
}
