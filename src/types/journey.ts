export type TransportMode = 'all' | 'road' | 'air' | 'sea' | 'rail';
export type JourneyStatus = 'all' | 'active' | 'delayed' | 'delivered' | 'critical';

export interface JourneyStop {
  id: string;
  name: string;
  type: 'factory' | 'warehouse' | 'port' | 'airport' | 'ocean' | 'air_transit' | 'road_transit' | 'rail_transit' | 'customs' | 'customer';
  location: string;
  lat: number;
  lng: number;
  status: 'completed' | 'in_progress' | 'upcoming';
  scheduledTime: string;
  actualTime?: string;
  note?: string;
}

export interface JourneyDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'sheet';
  size: string;
  date: string;
}

export interface JourneyAIInsight {
  delayReason?: string;
  recommendation?: string;
  riskSummary?: string;
  suggestedActions?: { id: string; label: string; primary?: boolean }[];
  weatherAlert?: string;
}

export interface JourneyMapOverlay {
  type: 'weather' | 'reroute' | 'port_queue' | 'delay' | 'speed';
  message: string;
  lat: number;
  lng: number;
}

export interface JourneyItem {
  id: string; // e.g. 'ODY-9842-SEA'
  title: string;
  mode: 'road' | 'air' | 'sea' | 'rail';
  status: 'active' | 'delayed' | 'delivered' | 'critical';
  carrier: string;
  vesselOrFlight?: string;
  origin: string;
  destination: string;
  originLat: number; // percentage (0-100) or coordinates for map canvas
  originLng: number;
  destLat: number;
  destLng: number;
  currentLat: number;
  currentLng: number;
  progressPercent: number; // 0-100
  containersCount: number;
  containerNumbers: string[];
  distanceRemaining: string;
  eta: string;
  etaVariance?: string; // e.g., '+12h delay'
  lastUpdated: string;
  departureDate: string;
  stops: JourneyStop[];
  documents: JourneyDocument[];
  aiInsight: JourneyAIInsight;
  mapOverlayAlert?: JourneyMapOverlay;
}

export interface JourneyActivityFeedItem {
  id: string;
  journeyId: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  location?: string;
}
