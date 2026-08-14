/**
 * ODYSSEY AI V2 — UNIFIED SYNTHETIC MASTER DATASET
 * 
 * Company: Odyssey Global Logistics
 * Prototype Period: June 1, 2026 → August 14, 2026
 * Note: All figures are synthetic enterprise prototype values for Odyssey Global Logistics.
 */

// Simple deterministic PRNG (Linear Congruential Generator / Mulberry32)
function createPrng(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ----------------------------------------------------------------------
// 1. PORTS (16 Ports: P001 → P016)
// ----------------------------------------------------------------------
export interface MasterPort {
  port_id: string;
  name: string;
  country: string;
  region: string;
  congestion: string; // 'Low', 'Moderate', 'Elevated', 'Severe'
  avg_vessel_wait_hours: number;
  avg_container_dwell_days: number;
  service_reliability_pct: number;
  yard_utilization_pct: number;
  status: 'Healthy' | 'Watch' | 'Critical';
  lat: number;
  lng: number;
  coord_x: number;
  coord_y: number;
  notes: string;
}

export const MASTER_PORTS: MasterPort[] = [
  {
    port_id: 'P001',
    name: 'Port of Shanghai',
    country: 'China',
    region: 'Asia-Pacific',
    congestion: 'Moderate',
    avg_vessel_wait_hours: 14.2,
    avg_container_dwell_days: 1.8,
    service_reliability_pct: 98.4,
    yard_utilization_pct: 88,
    status: 'Healthy',
    lat: 31.2304,
    lng: 121.4737,
    coord_x: 78,
    coord_y: 44,
    notes: 'High yard utilization but highly efficient automated quay throughput.'
  },
  {
    port_id: 'P002',
    name: 'Port of Singapore',
    country: 'Singapore',
    region: 'Asia-Pacific',
    congestion: 'Low',
    avg_vessel_wait_hours: 8.5,
    avg_container_dwell_days: 1.2,
    service_reliability_pct: 99.1,
    yard_utilization_pct: 79,
    status: 'Healthy',
    lat: 1.3521,
    lng: 103.8198,
    coord_x: 74,
    coord_y: 58,
    notes: 'World benchmark for transshipment speed; zero bunkering bottleneck.'
  },
  {
    port_id: 'P003',
    name: 'Port of Rotterdam',
    country: 'Netherlands',
    region: 'Europe',
    congestion: 'Elevated',
    avg_vessel_wait_hours: 32.4,
    avg_container_dwell_days: 3.4,
    service_reliability_pct: 84.6,
    yard_utilization_pct: 91,
    status: 'Watch',
    lat: 51.9244,
    lng: 4.4777,
    coord_x: 50,
    coord_y: 32,
    notes: 'Gate 4 berth queue backlogged; intermodal rail connections recovering.'
  },
  {
    port_id: 'P004',
    name: 'Port of Jebel Ali',
    country: 'UAE',
    region: 'Middle East',
    congestion: 'Low',
    avg_vessel_wait_hours: 10.2,
    avg_container_dwell_days: 1.5,
    service_reliability_pct: 97.8,
    yard_utilization_pct: 72,
    status: 'Healthy',
    lat: 25.0113,
    lng: 55.0617,
    coord_x: 62,
    coord_y: 46,
    notes: 'Smooth sea-to-air multimodal transfers; free-zone customs active.'
  },
  {
    port_id: 'P005',
    name: 'Port of Los Angeles',
    country: 'USA',
    region: 'North America',
    congestion: 'Elevated',
    avg_vessel_wait_hours: 28.6,
    avg_container_dwell_days: 3.1,
    service_reliability_pct: 86.2,
    yard_utilization_pct: 85,
    status: 'Watch',
    lat: 33.7432,
    lng: -118.2673,
    coord_x: 20,
    coord_y: 40,
    notes: 'Elevated variability; rail chassis staging pressure during peak shifts.'
  },
  {
    port_id: 'P006',
    name: 'Port of Long Beach',
    country: 'USA',
    region: 'North America',
    congestion: 'Moderate',
    avg_vessel_wait_hours: 21.0,
    avg_container_dwell_days: 2.6,
    service_reliability_pct: 89.4,
    yard_utilization_pct: 81,
    status: 'Healthy',
    lat: 33.7701,
    lng: -118.1937,
    coord_x: 21,
    coord_y: 41,
    notes: 'Pier B on-dock rail staging absorbing transpacific overflow.'
  },
  {
    port_id: 'P007',
    name: 'Port of Busan',
    country: 'South Korea',
    region: 'Asia-Pacific',
    congestion: 'Low',
    avg_vessel_wait_hours: 9.1,
    avg_container_dwell_days: 1.4,
    service_reliability_pct: 97.5,
    yard_utilization_pct: 76,
    status: 'Healthy',
    lat: 35.1796,
    lng: 129.0756,
    coord_x: 82,
    coord_y: 42,
    notes: 'High feeder efficiency across North Asia and transpacific routes.'
  },
  {
    port_id: 'P008',
    name: 'Port of Mumbai (JNPT)',
    country: 'India',
    region: 'South Asia',
    congestion: 'Moderate',
    avg_vessel_wait_hours: 19.8,
    avg_container_dwell_days: 2.7,
    service_reliability_pct: 91.2,
    yard_utilization_pct: 84,
    status: 'Watch',
    lat: 18.9499,
    lng: 72.9515,
    coord_x: 67,
    coord_y: 50,
    notes: 'Western Dedicated Freight Corridor (DFC) rail connections active.'
  },
  {
    port_id: 'P009',
    name: 'Port of Colombo',
    country: 'Sri Lanka',
    region: 'South Asia',
    congestion: 'Low',
    avg_vessel_wait_hours: 11.4,
    avg_container_dwell_days: 1.6,
    service_reliability_pct: 96.2,
    yard_utilization_pct: 74,
    status: 'Healthy',
    lat: 6.9271,
    lng: 79.8612,
    coord_x: 69,
    coord_y: 56,
    notes: 'South Asian transshipment hub operating with steady container turnaround.'
  },
  {
    port_id: 'P010',
    name: 'Port of Hamburg',
    country: 'Germany',
    region: 'Europe',
    congestion: 'Severe',
    avg_vessel_wait_hours: 38.2,
    avg_container_dwell_days: 4.1,
    service_reliability_pct: 76.0,
    yard_utilization_pct: 93,
    status: 'Critical',
    lat: 53.5511,
    lng: 9.9937,
    coord_x: 52,
    coord_y: 30,
    notes: 'Severe Elbe draft constraints and rail yard queue causing high dwell.'
  },
  {
    port_id: 'P011',
    name: 'Port of Santos',
    country: 'Brazil',
    region: 'South America',
    congestion: 'Moderate',
    avg_vessel_wait_hours: 24.5,
    avg_container_dwell_days: 2.9,
    service_reliability_pct: 88.0,
    yard_utilization_pct: 82,
    status: 'Watch',
    lat: -23.9618,
    lng: -46.3322,
    coord_x: 38,
    coord_y: 74,
    notes: 'Agricultural and food export volume peak; customs clearance stable.'
  },
  {
    port_id: 'P012',
    name: 'Port of Dubai',
    country: 'UAE',
    region: 'Middle East',
    congestion: 'Low',
    avg_vessel_wait_hours: 8.8,
    avg_container_dwell_days: 1.3,
    service_reliability_pct: 98.2,
    yard_utilization_pct: 70,
    status: 'Healthy',
    lat: 25.2048,
    lng: 55.2708,
    coord_x: 63,
    coord_y: 45,
    notes: 'Seamless regional distribution across GCC and East Africa corridors.'
  },
  {
    port_id: 'P013',
    name: 'Port of Hong Kong',
    country: 'Hong Kong',
    region: 'Asia-Pacific',
    congestion: 'Low',
    avg_vessel_wait_hours: 10.5,
    avg_container_dwell_days: 1.5,
    service_reliability_pct: 97.0,
    yard_utilization_pct: 75,
    status: 'Healthy',
    lat: 22.3193,
    lng: 114.1694,
    coord_x: 79,
    coord_y: 48,
    notes: 'High-density air/sea connectivity with Pearl River Delta manufacturers.'
  },
  {
    port_id: 'P014',
    name: 'Port Klang',
    country: 'Malaysia',
    region: 'Asia-Pacific',
    congestion: 'Low',
    avg_vessel_wait_hours: 11.2,
    avg_container_dwell_days: 1.6,
    service_reliability_pct: 96.4,
    yard_utilization_pct: 77,
    status: 'Healthy',
    lat: 2.9999,
    lng: 101.3928,
    coord_x: 73,
    coord_y: 57,
    notes: 'Strait of Malacca strategic waystation with growing ASEAN capacity.'
  },
  {
    port_id: 'P015',
    name: 'Port of Antwerp',
    country: 'Belgium',
    region: 'Europe',
    congestion: 'Low',
    avg_vessel_wait_hours: 16.0,
    avg_container_dwell_days: 2.1,
    service_reliability_pct: 94.2,
    yard_utilization_pct: 80,
    status: 'Healthy',
    lat: 51.2194,
    lng: 4.4025,
    coord_x: 49,
    coord_y: 33,
    notes: 'Absorbing partial North European overflow with smooth barge connections.'
  },
  {
    port_id: 'P016',
    name: 'Port of Felixstowe',
    country: 'UK',
    region: 'Europe',
    congestion: 'Moderate',
    avg_vessel_wait_hours: 22.4,
    avg_container_dwell_days: 2.8,
    service_reliability_pct: 89.8,
    yard_utilization_pct: 83,
    status: 'Healthy',
    lat: 51.9638,
    lng: 1.3511,
    coord_x: 48,
    coord_y: 30,
    notes: 'UK gateway container flow steady; road haulage capacity balanced.'
  }
];

// ----------------------------------------------------------------------
// 2. WAREHOUSES (8 Warehouses: W001 → W008)
// ----------------------------------------------------------------------
export interface MasterWarehouse {
  warehouse_id: string;
  name: string;
  capacity_pallets: number;
  utilization_pct: number;
  status: 'Healthy' | 'Watch' | 'At Capacity';
  region: string;
  country: string;
}

export const MASTER_WAREHOUSES: MasterWarehouse[] = [
  {
    warehouse_id: 'W001',
    name: 'Singapore Regional Hub',
    capacity_pallets: 18500,
    utilization_pct: 82,
    status: 'Healthy',
    region: 'Asia-Pacific',
    country: 'Singapore'
  },
  {
    warehouse_id: 'W002',
    name: 'Rotterdam Distribution Centre',
    capacity_pallets: 24000,
    utilization_pct: 74,
    status: 'Healthy',
    region: 'Europe',
    country: 'Netherlands'
  },
  {
    warehouse_id: 'W003',
    name: 'Dubai Central Hub',
    capacity_pallets: 17000,
    utilization_pct: 69,
    status: 'Healthy',
    region: 'Middle East',
    country: 'UAE'
  },
  {
    warehouse_id: 'W004',
    name: 'Mumbai Fulfilment Centre',
    capacity_pallets: 12500,
    utilization_pct: 77,
    status: 'Watch',
    region: 'South Asia',
    country: 'India'
  },
  {
    warehouse_id: 'W005',
    name: 'Los Angeles Distribution Centre',
    capacity_pallets: 21000,
    utilization_pct: 86,
    status: 'Watch',
    region: 'North America',
    country: 'USA'
  },
  {
    warehouse_id: 'W006',
    name: 'Frankfurt Inland Hub',
    capacity_pallets: 15500,
    utilization_pct: 63,
    status: 'Healthy',
    region: 'Europe',
    country: 'Germany'
  },
  {
    warehouse_id: 'W007',
    name: 'Shanghai Consolidation Hub',
    capacity_pallets: 22000,
    utilization_pct: 88,
    status: 'At Capacity',
    region: 'Asia-Pacific',
    country: 'China'
  },
  {
    warehouse_id: 'W008',
    name: 'Santos Regional Hub',
    capacity_pallets: 11000,
    utilization_pct: 58,
    status: 'Healthy',
    region: 'South America',
    country: 'Brazil'
  }
];

// ----------------------------------------------------------------------
// 3. CUSTOMERS (12 Customers: C001 → C012)
// ----------------------------------------------------------------------
export interface MasterCustomer {
  customer_id: string;
  name: string;
  industry: string;
  country: string;
  region: string;
  tier: string;
  account_owner: string;
  growth: string;
  growth_pct: number;
}

export const MASTER_CUSTOMERS: MasterCustomer[] = [
  { customer_id: 'C001', name: 'Northstar Retail', industry: 'Retail', country: 'Germany', region: 'Europe', tier: 'Enterprise VIP', account_owner: 'Sarah Jenkins', growth: '+14.2%', growth_pct: 14.2 },
  { customer_id: 'C002', name: 'Vertex Electronics', industry: 'Electronics', country: 'China', region: 'Asia-Pacific', tier: 'Strategic Key Account', account_owner: 'Marcus Vance', growth: '+28.4%', growth_pct: 28.4 },
  { customer_id: 'C003', name: 'Atlas Mobility', industry: 'Automotive', country: 'USA', region: 'North America', tier: 'Enterprise VIP', account_owner: 'Marcus Vance', growth: '+16.7%', growth_pct: 16.7 },
  { customer_id: 'C004', name: 'Helix Medical', industry: 'Healthcare', country: 'Netherlands', region: 'Europe', tier: 'High Growth', account_owner: 'Elena Rostova', growth: '+22.6%', growth_pct: 22.6 },
  { customer_id: 'C005', name: 'Nova Home', industry: 'Consumer Goods', country: 'UAE', region: 'Middle East', tier: 'Core Enterprise', account_owner: 'Sarah Jenkins', growth: '+9.4%', growth_pct: 9.4 },
  { customer_id: 'C006', name: 'Summit Energy', industry: 'Energy', country: 'India', region: 'South Asia', tier: 'High Growth', account_owner: 'Kenji Sato', growth: '+24.5%', growth_pct: 24.5 },
  { customer_id: 'C007', name: 'BluePeak Commerce', industry: 'E-commerce', country: 'Singapore', region: 'Asia-Pacific', tier: 'High Growth', account_owner: 'Kenji Sato', growth: '+31.8%', growth_pct: 31.8 },
  { customer_id: 'C008', name: 'Orion Industrial', industry: 'Industrial', country: 'Germany', region: 'Europe', tier: 'Core Enterprise', account_owner: 'Sarah Jenkins', growth: '+6.2%', growth_pct: 6.2 },
  { customer_id: 'C009', name: 'Crest Foods', industry: 'Food', country: 'Brazil', region: 'South America', tier: 'Core Enterprise', account_owner: 'Sarah Jenkins', growth: '+8.4%', growth_pct: 8.4 },
  { customer_id: 'C010', name: 'Aster Devices', industry: 'Technology', country: 'USA', region: 'North America', tier: 'Strategic Key Account', account_owner: 'Marcus Vance', growth: '+19.2%', growth_pct: 19.2 },
  { customer_id: 'C011', name: 'Meridian Pharma', industry: 'Healthcare', country: 'Switzerland', region: 'Europe', tier: 'Enterprise VIP', account_owner: 'Elena Rostova', growth: '+36.2%', growth_pct: 36.2 },
  { customer_id: 'C012', name: 'Pioneer Appliances', industry: 'Consumer Goods', country: 'India', region: 'South Asia', tier: 'Core Enterprise', account_owner: 'Kenji Sato', growth: '+11.5%', growth_pct: 11.5 }
];

// ----------------------------------------------------------------------
// 4. CARGO CATEGORIES (12 Cargo: G001 → G012)
// ----------------------------------------------------------------------
export interface MasterCargo {
  cargo_id: string;
  category: string;
  is_high_margin: boolean;
  base_margin_pct: number;
  growth_pct: number;
  demand_signal: 'Strong Surge' | 'High Value Priority' | 'Steady Climb' | 'Moderate' | 'Neutral';
  demand_drivers: string;
}

export const MASTER_CARGO: MasterCargo[] = [
  { cargo_id: 'G001', category: 'Consumer Electronics', is_high_margin: true, base_margin_pct: 36.5, growth_pct: 28.4, demand_signal: 'Strong Surge', demand_drivers: 'Next-gen silicon, AI accelerators, flagship mobile cycles' },
  { cargo_id: 'G002', category: 'Medical Equipment', is_high_margin: true, base_margin_pct: 42.0, growth_pct: 26.8, demand_signal: 'High Value Priority', demand_drivers: 'Hospital diagnostic imaging, surgical robots, sterile ICU devices' },
  { cargo_id: 'G003', category: 'EV Components', is_high_margin: true, base_margin_pct: 31.5, growth_pct: 22.4, demand_signal: 'Strong Surge', demand_drivers: 'Automotive OEM assembly ramp-up across EMEA & North America' },
  { cargo_id: 'G004', category: 'Solar Components', is_high_margin: false, base_margin_pct: 24.8, growth_pct: 19.2, demand_signal: 'Steady Climb', demand_drivers: 'Renewable grid tenders in Southern Europe and Middle East' },
  { cargo_id: 'G005', category: 'Industrial Machinery', is_high_margin: false, base_margin_pct: 22.4, growth_pct: 8.5, demand_signal: 'Moderate', demand_drivers: 'Factory automation and CNC machining replacement parts' },
  { cargo_id: 'G006', category: 'Apparel', is_high_margin: false, base_margin_pct: 18.2, growth_pct: 6.4, demand_signal: 'Moderate', demand_drivers: 'Fast fashion omnichannel seasonal retail collections' },
  { cargo_id: 'G007', category: 'Food Ingredients', is_high_margin: false, base_margin_pct: 16.5, growth_pct: 7.1, demand_signal: 'Neutral', demand_drivers: 'Bulk agricultural proteins and chilled perishables' },
  { cargo_id: 'G008', category: 'Pharmaceuticals', is_high_margin: false, base_margin_pct: 34.0, growth_pct: 21.5, demand_signal: 'High Value Priority', demand_drivers: 'Cold-chain vaccines and active pharmaceutical ingredients (API)' },
  { cargo_id: 'G009', category: 'Battery Materials', is_high_margin: true, base_margin_pct: 33.2, growth_pct: 24.1, demand_signal: 'Strong Surge', demand_drivers: 'Refined lithium, cathode precursors, energy storage modules' },
  { cargo_id: 'G010', category: 'Home Appliances', is_high_margin: false, base_margin_pct: 19.8, growth_pct: 9.8, demand_signal: 'Moderate', demand_drivers: 'Smart HVAC units and energy-saving kitchen appliances' },
  { cargo_id: 'G011', category: 'Auto Parts', is_high_margin: false, base_margin_pct: 23.5, growth_pct: 11.2, demand_signal: 'Steady Climb', demand_drivers: 'Tier-1 automotive subassemblies and replacement chassis' },
  { cargo_id: 'G012', category: 'Cloud Hardware', is_high_margin: true, base_margin_pct: 38.0, growth_pct: 34.2, demand_signal: 'Strong Surge', demand_drivers: 'High-density hyperscale data center racks and fiber optics' }
];

// ----------------------------------------------------------------------
// 5. CARRIERS (8 Carriers: CAR001 → CAR008)
// ----------------------------------------------------------------------
export interface MasterCarrier {
  carrier_id: string;
  name: string;
  mode: 'Sea' | 'Air' | 'Rail' | 'Multimodal';
  coverage: string;
  reliability_score: number;
}

export const MASTER_CARRIERS: MasterCarrier[] = [
  { carrier_id: 'CAR001', name: 'Maersk', mode: 'Sea', coverage: 'Global', reliability_score: 96.8 },
  { carrier_id: 'CAR002', name: 'MSC', mode: 'Sea', coverage: 'Global', reliability_score: 94.6 },
  { carrier_id: 'CAR003', name: 'CMA CGM', mode: 'Sea', coverage: 'Global', reliability_score: 95.2 },
  { carrier_id: 'CAR004', name: 'Hapag-Lloyd', mode: 'Sea', coverage: 'Transatlantic / Asia', reliability_score: 92.5 },
  { carrier_id: 'CAR005', name: 'ONE', mode: 'Sea', coverage: 'Transpacific / Asia', reliability_score: 95.8 },
  { carrier_id: 'CAR006', name: 'Evergreen', mode: 'Sea', coverage: 'Global', reliability_score: 93.4 },
  { carrier_id: 'CAR007', name: 'Emirates SkyCargo', mode: 'Air', coverage: 'Global Hubs', reliability_score: 98.6 },
  { carrier_id: 'CAR008', name: 'DHL Global Forwarding', mode: 'Multimodal', coverage: 'Global', reliability_score: 97.4 }
];

// ----------------------------------------------------------------------
// 6. SUPPLIERS (8 Suppliers: SUP001 → SUP008)
// ----------------------------------------------------------------------
export interface MasterSupplier {
  supplier_id: string;
  name: string;
  category: string;
  country: string;
  region: string;
  reliability_score: number;
}

export const MASTER_SUPPLIERS: MasterSupplier[] = [
  { supplier_id: 'SUP001', name: 'Shenzhen Components Ltd', category: 'Electronics', country: 'China', region: 'Asia-Pacific', reliability_score: 97.5 },
  { supplier_id: 'SUP002', name: 'Kansai Battery Materials', category: 'Battery / Energy', country: 'Japan', region: 'Asia-Pacific', reliability_score: 96.8 },
  { supplier_id: 'SUP003', name: 'Bavaria Medical Systems', category: 'Medical Equipment', country: 'Germany', region: 'Europe', reliability_score: 98.4 },
  { supplier_id: 'SUP004', name: 'Gulf Industrial Supply', category: 'Industrial', country: 'UAE', region: 'Middle East', reliability_score: 94.5 },
  { supplier_id: 'SUP005', name: 'Maharashtra Auto Components', category: 'Automotive Parts', country: 'India', region: 'South Asia', reliability_score: 91.8 },
  { supplier_id: 'SUP006', name: 'Pacific Home Products', category: 'Consumer Goods', country: 'Vietnam', region: 'Asia-Pacific', reliability_score: 93.2 },
  { supplier_id: 'SUP007', name: 'Santos Food Ingredients', category: 'Food & Agriculture', country: 'Brazil', region: 'South America', reliability_score: 92.0 },
  { supplier_id: 'SUP008', name: 'California Mobility Parts', category: 'EV / Mobility', country: 'USA', region: 'North America', reliability_score: 95.6 }
];

// ----------------------------------------------------------------------
// 7. CORE ROUTES (20 Routes: R001 → R020)
// ----------------------------------------------------------------------
export interface MasterRoute {
  route_id: string;
  origin_port_id: string;
  origin_name: string;
  dest_port_id: string;
  dest_name: string;
  transit_days: number;
  freight_baseline_usd: number;
  operating_cost_baseline_usd: number;
  growth_pct: number;
  reliability_pct: number;
  opportunity_score: number;
  signal: 'Rising' | 'Positive' | 'Watch' | 'Falling';
  risk_level: 'Low' | 'Medium' | 'High';
  mode: 'Sea' | 'Air' | 'Rail' | 'Road';
}

export const MASTER_ROUTES: MasterRoute[] = [
  { route_id: 'R001', origin_port_id: 'P001', origin_name: 'Shanghai', dest_port_id: 'P002', dest_name: 'Singapore', transit_days: 6, freight_baseline_usd: 5200, operating_cost_baseline_usd: 980, growth_pct: 18.2, reliability_pct: 98, opportunity_score: 92, signal: 'Rising', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R002', origin_port_id: 'P002', origin_name: 'Singapore', dest_port_id: 'P003', dest_name: 'Rotterdam', transit_days: 22, freight_baseline_usd: 5400, operating_cost_baseline_usd: 1040, growth_pct: 16.7, reliability_pct: 97, opportunity_score: 91, signal: 'Rising', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R003', origin_port_id: 'P008', origin_name: 'Mumbai', dest_port_id: 'P004', dest_name: 'Jebel Ali', transit_days: 5, freight_baseline_usd: 2100, operating_cost_baseline_usd: 620, growth_pct: 14.9, reliability_pct: 96, opportunity_score: 89, signal: 'Rising', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R004', origin_port_id: 'P001', origin_name: 'Shanghai', dest_port_id: 'P003', dest_name: 'Rotterdam', transit_days: 28, freight_baseline_usd: 7200, operating_cost_baseline_usd: 1250, growth_pct: 12.6, reliability_pct: 93, opportunity_score: 87, signal: 'Rising', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R005', origin_port_id: 'P002', origin_name: 'Singapore', dest_port_id: 'P005', dest_name: 'Los Angeles', transit_days: 18, freight_baseline_usd: 6100, operating_cost_baseline_usd: 1160, growth_pct: 11.8, reliability_pct: 91, opportunity_score: 84, signal: 'Positive', risk_level: 'Medium', mode: 'Sea' },
  { route_id: 'R006', origin_port_id: 'P007', origin_name: 'Busan', dest_port_id: 'P005', dest_name: 'Los Angeles', transit_days: 16, freight_baseline_usd: 5700, operating_cost_baseline_usd: 1080, growth_pct: 9.6, reliability_pct: 89, opportunity_score: 81, signal: 'Positive', risk_level: 'Medium', mode: 'Sea' },
  { route_id: 'R007', origin_port_id: 'P010', origin_name: 'Hamburg', dest_port_id: 'P004', dest_name: 'Jebel Ali', transit_days: 19, freight_baseline_usd: 4600, operating_cost_baseline_usd: 980, growth_pct: -7.4, reliability_pct: 76, opportunity_score: 48, signal: 'Falling', risk_level: 'High', mode: 'Sea' },
  { route_id: 'R008', origin_port_id: 'P003', origin_name: 'Rotterdam', dest_port_id: 'P008', dest_name: 'Mumbai', transit_days: 19, freight_baseline_usd: 4200, operating_cost_baseline_usd: 910, growth_pct: -4.2, reliability_pct: 82, opportunity_score: 54, signal: 'Falling', risk_level: 'Medium', mode: 'Sea' },
  { route_id: 'R009', origin_port_id: 'P004', origin_name: 'Jebel Ali', dest_port_id: 'P008', dest_name: 'Mumbai', transit_days: 4, freight_baseline_usd: 1700, operating_cost_baseline_usd: 560, growth_pct: 8.9, reliability_pct: 94, opportunity_score: 83, signal: 'Positive', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R010', origin_port_id: 'P011', origin_name: 'Santos', dest_port_id: 'P003', dest_name: 'Rotterdam', transit_days: 22, freight_baseline_usd: 5900, operating_cost_baseline_usd: 1140, growth_pct: 6.1, reliability_pct: 88, opportunity_score: 79, signal: 'Positive', risk_level: 'Medium', mode: 'Sea' },
  { route_id: 'R011', origin_port_id: 'P001', origin_name: 'Shanghai', dest_port_id: 'P004', dest_name: 'Jebel Ali', transit_days: 21, freight_baseline_usd: 5000, operating_cost_baseline_usd: 970, growth_pct: 15.4, reliability_pct: 95, opportunity_score: 88, signal: 'Rising', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R012', origin_port_id: 'P008', origin_name: 'Mumbai', dest_port_id: 'P003', dest_name: 'Rotterdam', transit_days: 20, freight_baseline_usd: 4800, operating_cost_baseline_usd: 980, growth_pct: 10.8, reliability_pct: 92, opportunity_score: 85, signal: 'Positive', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R013', origin_port_id: 'W006', origin_name: 'Frankfurt', dest_port_id: 'P003', dest_name: 'Rotterdam', transit_days: 1, freight_baseline_usd: 650, operating_cost_baseline_usd: 180, growth_pct: 5.7, reliability_pct: 95, opportunity_score: 82, signal: 'Positive', risk_level: 'Low', mode: 'Road' },
  { route_id: 'R014', origin_port_id: 'P002', origin_name: 'Singapore', dest_port_id: 'P012', dest_name: 'Dubai', transit_days: 10, freight_baseline_usd: 3500, operating_cost_baseline_usd: 760, growth_pct: 13.2, reliability_pct: 96, opportunity_score: 87, signal: 'Rising', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R015', origin_port_id: 'P005', origin_name: 'Los Angeles', dest_port_id: 'P003', dest_name: 'Rotterdam', transit_days: 25, freight_baseline_usd: 6100, operating_cost_baseline_usd: 1250, growth_pct: -3.6, reliability_pct: 79, opportunity_score: 51, signal: 'Falling', risk_level: 'High', mode: 'Sea' },
  { route_id: 'R016', origin_port_id: 'P009', origin_name: 'Colombo', dest_port_id: 'P008', dest_name: 'Mumbai', transit_days: 3, freight_baseline_usd: 1200, operating_cost_baseline_usd: 420, growth_pct: 7.4, reliability_pct: 94, opportunity_score: 80, signal: 'Positive', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R017', origin_port_id: 'P007', origin_name: 'Busan', dest_port_id: 'P002', dest_name: 'Singapore', transit_days: 8, freight_baseline_usd: 2300, operating_cost_baseline_usd: 590, growth_pct: 10.3, reliability_pct: 96, opportunity_score: 85, signal: 'Positive', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R018', origin_port_id: 'P001', origin_name: 'Shanghai', dest_port_id: 'P008', dest_name: 'Mumbai', transit_days: 13, freight_baseline_usd: 3600, operating_cost_baseline_usd: 780, growth_pct: 9.8, reliability_pct: 91, opportunity_score: 82, signal: 'Positive', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R019', origin_port_id: 'P004', origin_name: 'Jebel Ali', dest_port_id: 'P003', dest_name: 'Rotterdam', transit_days: 16, freight_baseline_usd: 4100, operating_cost_baseline_usd: 880, growth_pct: 12.1, reliability_pct: 93, opportunity_score: 88, signal: 'Rising', risk_level: 'Low', mode: 'Sea' },
  { route_id: 'R020', origin_port_id: 'P011', origin_name: 'Santos', dest_port_id: 'P004', dest_name: 'Jebel Ali', transit_days: 27, freight_baseline_usd: 6800, operating_cost_baseline_usd: 1280, growth_pct: -1.8, reliability_pct: 81, opportunity_score: 57, signal: 'Watch', risk_level: 'Medium', mode: 'Sea' }
];

// ----------------------------------------------------------------------
// 8. FUEL & LABOUR & TAX ASSUMPTIONS
// ----------------------------------------------------------------------
export const FUEL_ASSUMPTIONS = {
  june: { index_usd: 560, label: 'June 2026: VLSFO $560/MT' },
  july: { index_usd: 575, label: 'July 2026: VLSFO $575/MT' },
  august: { index_usd: 545, label: 'August 2026: VLSFO $545/MT (~5% lower than July)' }
};

export const LABOUR_ASSUMPTIONS: Record<string, { hourly_usd: number; country: string }> = {
  Singapore: { hourly_usd: 52, country: 'Singapore' },
  Netherlands: { hourly_usd: 61, country: 'Netherlands' },
  UAE: { hourly_usd: 43, country: 'UAE' },
  India: { hourly_usd: 31, country: 'India' },
  USA: { hourly_usd: 67, country: 'USA' },
  Germany: { hourly_usd: 48, country: 'Germany' },
  China: { hourly_usd: 29, country: 'China' },
  Brazil: { hourly_usd: 24, country: 'Brazil' }
};

export const TAX_ASSUMPTIONS: Record<string, string> = {
  India: 'Product-specific import duty (illustrative)',
  UAE: '5% baseline assumption (illustrative)',
  Netherlands: '21% VAT assumption (illustrative)',
  Germany: '19% VAT assumption (illustrative)',
  Singapore: '9% GST assumption (illustrative)',
  USA: 'Product-specific customs duties (illustrative)',
  Brazil: 'Product-specific / complex ICMS & IPI (illustrative)'
};

// ----------------------------------------------------------------------
// 9. EXTERNAL SIGNALS (12 Signals across Weather, Geopolitics, Fuel, Port)
// ----------------------------------------------------------------------
export interface MasterExternalSignal {
  signal_id: string;
  category: 'Weather' | 'Geopolitical' | 'Trade' | 'Fuel' | 'Port';
  title: string;
  location: string;
  impact_level: 'High' | 'Medium' | 'Low';
  trend: 'Positive' | 'Neutral' | 'Negative';
  description: string;
  detected_date: string;
}

export const MASTER_EXTERNAL_SIGNALS: MasterExternalSignal[] = [
  { signal_id: 'SIG-001', category: 'Weather', title: 'South China Sea Monsoon Window Open', location: 'Singapore – Europe', impact_level: 'Low', trend: 'Positive', description: 'Monsoon conditions clear along Malacca and Sunda Straits; vessel passage speeds optimal.', detected_date: '2026-08-10' },
  { signal_id: 'SIG-002', category: 'Weather', title: 'North Pacific Low Pressure Watch', location: 'North Pacific / Transpacific', impact_level: 'Medium', trend: 'Neutral', description: 'Moderate swell advisory for Great Circle routes into LA/Long Beach; +6h voyage buffer recommended.', detected_date: '2026-08-11' },
  { signal_id: 'SIG-003', category: 'Port', title: 'Port of Hamburg Yard Capacity Strain', location: 'Hamburg, Germany', impact_level: 'High', trend: 'Negative', description: 'Elbe shallow draft and rail bottleneck holding container dwell above 4.1 days.', detected_date: '2026-08-12' },
  { signal_id: 'SIG-004', category: 'Port', title: 'Los Angeles Off-Peak Gate Shift', location: 'Los Angeles, USA', impact_level: 'Medium', trend: 'Neutral', description: 'Night-gate incentive active; chassis turn-time stabilized at 1.9 days.', detected_date: '2026-08-12' },
  { signal_id: 'SIG-005', category: 'Trade', title: 'Asia-Europe Electronics Surge', location: 'Asia – Europe', impact_level: 'High', trend: 'Positive', description: 'Q3 high-density compute shipments up +28.4% on Shanghai → Singapore → Rotterdam lanes.', detected_date: '2026-08-13' },
  { signal_id: 'SIG-006', category: 'Fuel', title: 'Global Bunker Index Eases -5.2%', location: 'Global Fuel Centers', impact_level: 'Medium', trend: 'Positive', description: 'August VLSFO settled at $545/MT, down from $575/MT in July, lowering voyage cost variance.', detected_date: '2026-08-01' },
  { signal_id: 'SIG-007', category: 'Geopolitical', title: 'Bab-el-Mandeb Strait Escort Advisory', location: 'Red Sea / Gulf of Aden', impact_level: 'High', trend: 'Negative', description: 'Commercial naval convoys operating; select bulk carriers adding +4 days around Cape of Good Hope.', detected_date: '2026-08-08' },
  { signal_id: 'SIG-008', category: 'Trade', title: 'India-Middle East CEPA Corridor Expansion', location: 'Mumbai – Jebel Ali', impact_level: 'High', trend: 'Positive', description: 'Preferential tariff execution accelerating fast-track cargo clearances under 24 hours.', detected_date: '2026-08-09' },
  { signal_id: 'SIG-009', category: 'Port', title: 'Singapore Berth Zero-Queue Window', location: 'Singapore', impact_level: 'Medium', trend: 'Positive', description: 'Berth waiting times averaging under 8.5 hours across Tuas Mega Port terminals.', detected_date: '2026-08-14' },
  { signal_id: 'SIG-010', category: 'Weather', title: 'Santos Winter Sea Swell Warning', location: 'Santos, Brazil', impact_level: 'Medium', trend: 'Negative', description: 'Terminal 3 pilotage restricted during night hours; small coastal delay expected.', detected_date: '2026-08-13' }
];

// ----------------------------------------------------------------------
// 10. TARGETS (Executive Targets & SLAs)
// ----------------------------------------------------------------------
export interface MasterTarget {
  id: string;
  metric: string;
  target_value: number;
  current_value: number;
  formatted_target: string;
  formatted_current: string;
  unit: string;
  status: 'Ahead' | 'On Track' | 'At Risk' | 'Critical Gap';
  category: string;
  quarter: string;
}

export const MASTER_TARGETS: MasterTarget[] = [
  { id: 'TGT-001', metric: 'On-Time Delivery (OTD)', target_value: 95.0, current_value: 93.8, formatted_target: '95.0%', formatted_current: '93.8%', unit: '%', status: 'At Risk', category: 'Service SLA', quarter: 'Q3 2026' },
  { id: 'TGT-002', metric: 'On-Time In-Full (OTIF)', target_value: 93.0, current_value: 91.6, formatted_target: '93.0%', formatted_current: '91.6%', unit: '%', status: 'At Risk', category: 'Service SLA', quarter: 'Q3 2026' },
  { id: 'TGT-003', metric: 'Gross Revenue', target_value: 12.5, current_value: 11.84, formatted_target: '$12.50M', formatted_current: '$11.84M', unit: '$M', status: 'On Track', category: 'Financial', quarter: 'Q3 2026' },
  { id: 'TGT-004', metric: 'Gross Profit', target_value: 3.60, current_value: 3.49, formatted_target: '$3.60M', formatted_current: '$3.49M', unit: '$M', status: 'On Track', category: 'Financial', quarter: 'Q3 2026' },
  { id: 'TGT-005', metric: 'ETA Accuracy', target_value: 95.0, current_value: 94.1, formatted_target: '95.0%', formatted_current: '94.1%', unit: '%', status: 'On Track', category: 'Service SLA', quarter: 'Q3 2026' },
  { id: 'TGT-006', metric: 'High-Risk Shipments', target_value: 25, current_value: 18, formatted_target: '< 25', formatted_current: '18 active', unit: 'count', status: 'Ahead', category: 'Risk Control', quarter: 'Q3 2026' },
  { id: 'TGT-007', metric: 'Avg Port Dwell', target_value: 3.0, current_value: 2.8, formatted_target: '< 3.0 days', formatted_current: '2.8 days', unit: 'days', status: 'Ahead', category: 'Operational', quarter: 'Q3 2026' },
  { id: 'TGT-008', metric: 'Premium Freight Spend', target_value: 300, current_value: 214, formatted_target: '< $300K', formatted_current: '$214K', unit: '$K', status: 'Ahead', category: 'Cost Efficiency', quarter: 'Q3 2026' }
];

// ----------------------------------------------------------------------
// 11. SMART STAFF AI AGENTS (5 Visible Agents)
// ----------------------------------------------------------------------
export interface MasterSmartStaffAgent {
  id: string;
  name: string;
  role: string;
  purpose: string;
  status: 'Active' | 'Analyzing' | 'Idle' | 'Action Queued';
  coverage: string;
  specialty: string;
  avatar_icon: string;
  tasks_completed_today: number;
  accuracy_rate: string;
  latency: string;
  cost_saved_week: string;
  reroutes_executed: number;
  latest_activity: {
    timestamp: string;
    title: string;
    description: string;
    impact: string;
  };
}

export const MASTER_SMART_STAFF: MasterSmartStaffAgent[] = [
  {
    id: 'agent-journey-monitor',
    name: 'Journey Monitor',
    role: 'Automated Dispatch & Exception Sentinel',
    purpose: 'Monitor shipment status, ETA and exceptions.',
    status: 'Active',
    coverage: '500 Live Shipments & Port Hubs',
    specialty: 'ETA Variance Prediction & Milestones',
    avatar_icon: 'Navigation',
    tasks_completed_today: 184,
    accuracy_rate: '99.4%',
    latency: '142ms',
    cost_saved_week: '$42,800',
    reroutes_executed: 14,
    latest_activity: {
      timestamp: '4 minutes ago',
      title: 'Monitored SH10027 on R002 Corridor',
      description: 'Detected canal waypoint clearance for SH10027 (Singapore → Rotterdam). Updated arrival window to 2026-08-07 (+24h buffer).',
      impact: 'Automated ETA notification transmitted to Vertex Electronics.'
    }
  },
  {
    id: 'agent-route-analyst',
    name: 'Route Analyst',
    role: 'Network Corridor Profit & Flow Engine',
    purpose: 'Analyze route profitability, growth and opportunity.',
    status: 'Active',
    coverage: '20 Global Corridors',
    specialty: 'Throughput Modeling & Expansion Scoring',
    avatar_icon: 'TrendingUp',
    tasks_completed_today: 96,
    accuracy_rate: '99.1%',
    latency: '210ms',
    cost_saved_week: '$68,400',
    reroutes_executed: 8,
    latest_activity: {
      timestamp: '18 minutes ago',
      title: 'Evaluated Shanghai → Singapore (R001) Profitability',
      description: 'Verified lane operating margin at 36.8% with +18.2% volume growth. Confirmed top rank in Rising leaderboard.',
      impact: 'Generated expansion recommendation for Q4 feeder capacity.'
    }
  },
  {
    id: 'agent-risk-analyst',
    name: 'Risk Analyst',
    role: 'Predictive Port Congestion & Disruption Radar',
    purpose: 'Analyze operational and external risk.',
    status: 'Active',
    coverage: '16 Global Ports & Weather Grids',
    specialty: 'Geopolitical & Bottleneck Mitigation',
    avatar_icon: 'ShieldAlert',
    tasks_completed_today: 142,
    accuracy_rate: '98.9%',
    latency: '180ms',
    cost_saved_week: '$89,200',
    reroutes_executed: 19,
    latest_activity: {
      timestamp: '32 minutes ago',
      title: 'Flagged Hamburg (P010) Port Dwell Surge',
      description: 'Dwell time reached 4.1 days due to Elbe draft limits. Re-routed 6 upcoming European consignments to Port of Antwerp (P015).',
      impact: 'Prevented ~$54,000 in detention fees and 72h delivery delays.'
    }
  },
  {
    id: 'agent-revenue-analyst',
    name: 'Revenue Analyst',
    role: 'Margin Optimizer & Dynamic Freight Yield Manager',
    purpose: 'Analyze revenue, cost and margins.',
    status: 'Active',
    coverage: '12 Key Accounts & 12 Cargo Lines',
    specialty: 'Landed Cost Analysis & Surcharge Tracking',
    avatar_icon: 'DollarSign',
    tasks_completed_today: 118,
    accuracy_rate: '99.6%',
    latency: '165ms',
    cost_saved_week: '$114,000',
    reroutes_executed: 11,
    latest_activity: {
      timestamp: '45 minutes ago',
      title: 'Audited Fuel Index & August Cost Impact',
      description: 'Reflected -5.2% fuel decrease ($545/MT). Updated net margin pacing to 29.5% across transpacific and European trades.',
      impact: 'Yield model re-calibrated across 500 active orders.'
    }
  },
  {
    id: 'agent-report-assistant',
    name: 'Report Assistant',
    role: 'Executive Intelligence & Briefing Synthesizer',
    purpose: 'Prepare business summaries and reports.',
    status: 'Active',
    coverage: 'Global Executive Stakeholders',
    specialty: 'Natural Language Synthesis & PDF Briefs',
    avatar_icon: 'FileText',
    tasks_completed_today: 52,
    accuracy_rate: '99.8%',
    latency: '340ms',
    cost_saved_week: '$31,500',
    reroutes_executed: 4,
    latest_activity: {
      timestamp: '1 hour ago',
      title: 'Synthesized Q3 Executive Logistics Briefing',
      description: 'Compiled comprehensive prototype audit covering $11.84M gross revenue, 93.8% OTD, and Rising vs Falling lane dynamics.',
      impact: 'Published executive briefing document to board portal.'
    }
  }
];

// ----------------------------------------------------------------------
// 12. DETERMINISTIC GENERATOR FOR 500 SHIPMENTS, 1100 CONTAINERS, 500 ORDERS & 900 EVENTS
// ----------------------------------------------------------------------

export interface MasterShipment {
  shipment_id: string;
  route_id: string;
  customer_id: string;
  cargo_id: string;
  supplier_id: string;
  carrier_id: string;
  mode: 'Sea' | 'Air' | 'Rail' | 'Road';
  booking_date: string;
  etd: string;
  planned_eta: string;
  actual_delivery: string | null;
  status: 'Delivered' | 'In Transit' | 'Booked' | 'Delayed' | 'At Port' | 'Customs Hold';
  teu: number;
  weight_tonnes: number;
  freight_usd: number;
  fuel_surcharge_usd: number;
  handling_usd: number;
  customs_usd: number;
  labor_usd: number;
  insurance_usd: number;
  other_cost_usd: number;
  total_cost_usd: number;
  revenue_usd: number;
  profit_usd: number;
  margin_pct: number;
  delay_hours: number;
  risk_level: 'Low' | 'Medium' | 'High';
  // Relational joins
  route_name?: string;
  customer_name?: string;
  cargo_name?: string;
  carrier_name?: string;
  origin_name?: string;
  dest_name?: string;
}

export interface MasterContainer {
  container_id: string;
  shipment_id: string;
  route_id: string;
  size: '20GP' | '40GP' | '40HC';
  temperature_class: 'Standard Dry' | 'Reefer Pharma' | 'Ambient' | 'Controlled Atmosphere';
  weight_tonnes: number;
  load_type: 'FCL' | 'LCL';
  status: 'Loaded' | 'At Sea' | 'At Port' | 'Empty Return' | 'Delivered';
}

export interface MasterOrder {
  order_id: string;
  shipment_id: string;
  customer_id: string;
  cargo_id: string;
  units: number;
  status: 'Fulfilled' | 'In Transit' | 'Processing' | 'Held';
  priority: 'Standard' | 'Priority' | 'Critical';
}

export interface MasterOperationalEvent {
  event_id: string;
  shipment_id: string;
  route_id: string;
  event_type: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical' | 'resolved';
  location: string;
}

// Generate the complete deterministic dataset
export function generateMasterDataset() {
  const prng = createPrng(20260814);

  const shipments: MasterShipment[] = [];
  const containers: MasterContainer[] = [];
  const orders: MasterOrder[] = [];
  const events: MasterOperationalEvent[] = [];

  // Target Status Distribution across 500 shipments:
  // ~35% Delivered (175)
  // ~35% In Transit (175)
  // ~8% Booked (40)
  // ~9% Delayed (45)
  // ~8% At Port (40)
  // ~5% Customs Hold (25)
  // Total = 500

  const statuses: Array<'Delivered' | 'In Transit' | 'Booked' | 'Delayed' | 'At Port' | 'Customs Hold'> = [];
  for (let i = 0; i < 175; i++) statuses.push('Delivered');
  for (let i = 0; i < 175; i++) statuses.push('In Transit');
  for (let i = 0; i < 40; i++) statuses.push('Booked');
  for (let i = 0; i < 45; i++) statuses.push('Delayed');
  for (let i = 0; i < 40; i++) statuses.push('At Port');
  for (let i = 0; i < 25; i++) statuses.push('Customs Hold');

  // Shuffle statuses deterministically
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    const temp = statuses[i];
    statuses[i] = statuses[j];
    statuses[j] = temp;
  }

  // Ensure SH10027 has explicit fixed parameters as specified
  // SH10027: Singapore -> Rotterdam (R002), Vertex Electronics (C002), Consumer Electronics (G001), Maersk (CAR001)

  for (let index = 1; index <= 500; index++) {
    const idNum = 10000 + index;
    const shipmentId = `SH${idNum}`;

    let route: MasterRoute;
    let customer: MasterCustomer;
    let cargo: MasterCargo;
    let carrier: MasterCarrier;
    let supplier: MasterSupplier;
    let status: 'Delivered' | 'In Transit' | 'Booked' | 'Delayed' | 'At Port' | 'Customs Hold';
    let teu: number;
    let weightTonnes: number;
    let bookingDate: string;
    let etd: string;
    let plannedEta: string;
    let actualDelivery: string | null = null;
    let delayHours = 0;
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

    if (shipmentId === 'SH10027') {
      route = MASTER_ROUTES.find((r) => r.route_id === 'R002')!;
      customer = MASTER_CUSTOMERS.find((c) => c.customer_id === 'C002')!;
      cargo = MASTER_CARGO.find((g) => g.cargo_id === 'G001')!;
      carrier = MASTER_CARRIERS.find((c) => c.carrier_id === 'CAR001')!;
      supplier = MASTER_SUPPLIERS.find((s) => s.supplier_id === 'SUP001')!;
      status = 'In Transit';
      teu = 4;
      weightTonnes = 58.4;
      bookingDate = '2026-07-12';
      etd = '2026-07-15';
      plannedEta = '2026-08-06';
      delayHours = 18;
      riskLevel = 'Medium';
    } else {
      // Deterministically pick route (weighted towards high volume routes)
      const routeIdx = (index - 1) % MASTER_ROUTES.length;
      route = MASTER_ROUTES[routeIdx];

      // Pick Customer
      const custIdx = Math.floor(prng() * MASTER_CUSTOMERS.length);
      customer = MASTER_CUSTOMERS[custIdx];

      // Pick Cargo (align high tech with Vertex, etc.)
      const cargoIdx = (index * 3) % MASTER_CARGO.length;
      cargo = MASTER_CARGO[cargoIdx];

      // Pick Carrier & Supplier
      const carrierIdx = (index * 2) % MASTER_CARRIERS.length;
      carrier = MASTER_CARRIERS[carrierIdx];
      const supplierIdx = (index * 5) % MASTER_SUPPLIERS.length;
      supplier = MASTER_SUPPLIERS[supplierIdx];

      status = statuses[index - 1];

      teu = 1 + Math.floor(prng() * 4) * 2; // 1, 3, 5, 7 or 2, 4
      weightTonnes = Math.round((teu * 14.5 + prng() * 6) * 10) / 10;

      // Dates between June 1, 2026 and August 14, 2026
      const startDayOffset = Math.floor(prng() * 60); // 0 to 60 days from June 1
      const booking = new Date(2026, 5, 1 + startDayOffset);
      const etdDate = new Date(booking.getTime() + (2 + Math.floor(prng() * 4)) * 86400000);
      const etaDate = new Date(etdDate.getTime() + route.transit_days * 86400000);

      bookingDate = booking.toISOString().split('T')[0];
      etd = etdDate.toISOString().split('T')[0];
      plannedEta = etaDate.toISOString().split('T')[0];

      if (status === 'Delivered') {
        actualDelivery = new Date(etaDate.getTime() + Math.floor(prng() * 2) * 86400000).toISOString().split('T')[0];
        delayHours = Math.floor(prng() * 6);
        riskLevel = 'Low';
      } else if (status === 'Delayed') {
        delayHours = 24 + Math.floor(prng() * 72);
        riskLevel = delayHours > 48 ? 'High' : 'Medium';
      } else if (status === 'Customs Hold') {
        delayHours = 36 + Math.floor(prng() * 48);
        riskLevel = 'High';
      } else {
        delayHours = 0;
        riskLevel = route.risk_level === 'High' ? 'Medium' : 'Low';
      }
    }

    // Financial Calculation
    // Total Cost = Freight + Fuel + Handling + Customs + Labor + Insurance + Other
    // Profit = Revenue - Total Cost
    // Margin % = Profit / Revenue * 100
    const baseFreight = (route.freight_baseline_usd / 2) * teu;
    const fuelCost = Math.round(baseFreight * 0.12 * (1 + (prng() - 0.5) * 0.1));
    const handlingCost = Math.round(teu * 280 + prng() * 150);
    const customsCost = Math.round(350 + prng() * 300);
    const laborCost = Math.round(teu * 180 + prng() * 100);
    const insuranceCost = Math.round(baseFreight * 0.045);
    const otherCost = Math.round(150 + prng() * 120);

    const totalCost = baseFreight + fuelCost + handlingCost + customsCost + laborCost + insuranceCost + otherCost;

    // Apply cargo and route margin multipliers
    let targetMargin = cargo.base_margin_pct / 100;
    if (route.signal === 'Rising') targetMargin += 0.04;
    if (route.signal === 'Falling') targetMargin -= 0.08;
    if (status === 'Delayed') targetMargin -= 0.03;

    targetMargin = Math.max(0.12, Math.min(0.48, targetMargin));

    const revenue = Math.round(totalCost / (1 - targetMargin));
    const profit = revenue - totalCost;
    const marginPct = Math.round((profit / revenue) * 1000) / 10;

    const shipment: MasterShipment = {
      shipment_id: shipmentId,
      route_id: route.route_id,
      customer_id: customer.customer_id,
      cargo_id: cargo.cargo_id,
      supplier_id: supplier.supplier_id,
      carrier_id: carrier.carrier_id,
      mode: route.mode,
      booking_date: bookingDate,
      etd,
      planned_eta: plannedEta,
      actual_delivery: actualDelivery,
      status,
      teu,
      weight_tonnes: weightTonnes,
      freight_usd: baseFreight,
      fuel_surcharge_usd: fuelCost,
      handling_usd: handlingCost,
      customs_usd: customsCost,
      labor_usd: laborCost,
      insurance_usd: insuranceCost,
      other_cost_usd: otherCost,
      total_cost_usd: totalCost,
      revenue_usd: revenue,
      profit_usd: profit,
      margin_pct: marginPct,
      delay_hours: delayHours,
      risk_level: riskLevel,
      route_name: `${route.origin_name} → ${route.dest_name}`,
      customer_name: customer.name,
      cargo_name: cargo.category,
      carrier_name: carrier.name,
      origin_name: route.origin_name,
      dest_name: route.dest_name
    };

    shipments.push(shipment);

    // Containers (~2.2 containers per shipment on avg -> ~1,100 containers)
    const containerCount = Math.max(1, Math.min(4, teu));
    for (let c = 0; c < containerCount; c++) {
      const cId = `CONT${100000 + containers.length + 1}`;
      const sizeChoices: Array<'20GP' | '40GP' | '40HC'> = ['20GP', '40GP', '40HC'];
      const tempChoices: Array<'Standard Dry' | 'Reefer Pharma' | 'Ambient' | 'Controlled Atmosphere'> =
        cargo.category.includes('Medical') || cargo.category.includes('Pharma') || cargo.category.includes('Food')
          ? ['Reefer Pharma', 'Controlled Atmosphere']
          : ['Standard Dry', 'Ambient'];

      containers.push({
        container_id: cId,
        shipment_id: shipmentId,
        route_id: route.route_id,
        size: sizeChoices[c % 3],
        temperature_class: tempChoices[c % tempChoices.length],
        weight_tonnes: Math.round((weightTonnes / containerCount) * 10) / 10,
        load_type: teu > 1 ? 'FCL' : 'LCL',
        status:
          status === 'Delivered'
            ? 'Delivered'
            : status === 'In Transit'
            ? 'At Sea'
            : status === 'At Port' || status === 'Delayed'
            ? 'At Port'
            : 'Loaded'
      });
    }

    // Orders (1 order per shipment -> 500 orders)
    orders.push({
      order_id: `ORD${20000 + index}`,
      shipment_id: shipmentId,
      customer_id: customer.customer_id,
      cargo_id: cargo.cargo_id,
      units: Math.round((teu * 180 + prng() * 200) / 10) * 10,
      status: status === 'Delivered' ? 'Fulfilled' : status === 'In Transit' ? 'In Transit' : status === 'Customs Hold' ? 'Held' : 'Processing',
      priority: riskLevel === 'High' ? 'Critical' : cargo.is_high_margin ? 'Priority' : 'Standard'
    });
  }

  // Operational Events (~900 events)
  const eventTypes = [
    { type: 'Booking Confirmed', sev: 'info', desc: 'Electronic booking confirmation acknowledged by carrier.' },
    { type: 'Container Loaded', sev: 'info', desc: 'Seal verified and container loaded at origin consolidation yard.' },
    { type: 'Port Departure', sev: 'info', desc: 'Vessel departure logged; outbound pilotage completed.' },
    { type: 'ETA Updated', sev: 'info', desc: 'AIS satellite waypoint telemetry calculated fresh ETA window.' },
    { type: 'Port Arrival', sev: 'info', desc: 'Inbound vessel anchored at terminal berth; crane discharge queued.' },
    { type: 'Container Discharged', sev: 'info', desc: 'Gantry crane discharge completed onto terminal chassis.' },
    { type: 'Customs Cleared', sev: 'resolved', desc: 'Import declaration cleared green lane without physical inspection.' },
    { type: 'Delay Detected', sev: 'warning', desc: 'Berth queue or transit buffer deviation detected by Journey Monitor.' },
    { type: 'Weather Alert', sev: 'warning', desc: 'Monsoon swell / maritime weather advisory logged on transit corridor.' },
    { type: 'Delivery Confirmed', sev: 'resolved', desc: 'Final consignee signature acknowledged at destination facility.' }
  ];

  // Distribute ~900 events across the 500 shipments
  for (let i = 0; i < 900; i++) {
    const sIdx = i % shipments.length;
    const shipment = shipments[sIdx];
    const evTemplate = eventTypes[i % eventTypes.length];
    const evId = `EV${100000 + i + 1}`;

    const dateOffset = Math.floor((i / 900) * 70);
    const evDate = new Date(2026, 5, 2 + dateOffset);

    events.push({
      event_id: evId,
      shipment_id: shipment.shipment_id,
      route_id: shipment.route_id,
      event_type: evTemplate.type,
      title: `${evTemplate.type} — ${shipment.shipment_id}`,
      description: `${evTemplate.desc} (${shipment.route_name})`,
      timestamp: `${evDate.toISOString().split('T')[0]} 08:30 UTC`,
      severity: shipment.status === 'Delayed' && evTemplate.type === 'Delay Detected' ? 'critical' : (evTemplate.sev as any),
      location: shipment.origin_name || 'Global Terminal'
    });
  }

  return {
    ports: MASTER_PORTS,
    warehouses: MASTER_WAREHOUSES,
    customers: MASTER_CUSTOMERS,
    cargo: MASTER_CARGO,
    carriers: MASTER_CARRIERS,
    suppliers: MASTER_SUPPLIERS,
    routes: MASTER_ROUTES,
    shipments,
    containers,
    orders,
    events,
    externalSignals: MASTER_EXTERNAL_SIGNALS,
    targets: MASTER_TARGETS,
    smartStaff: MASTER_SMART_STAFF,
    fuel: FUEL_ASSUMPTIONS,
    labour: LABOUR_ASSUMPTIONS,
    tax: TAX_ASSUMPTIONS
  };
}

// Single initialized instance for fast deterministic access across frontend & backend
export const UNIFIED_MASTER_DATA = generateMasterDataset();
