import { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  iconName: string;
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
}

export interface StatusCardItem {
  id: string;
  title: string;
  value: string;
  supportingText: string;
  trend: string;
  trendType: 'positive' | 'neutral' | 'negative';
  iconName: string;
}

export interface SupplyNode {
  id: string;
  name: string;
  region: string;
  type: 'hub' | 'port' | 'facility' | 'supplier';
  status: 'optimal' | 'warning' | 'critical';
  lat: number; // percentage coordinates for vector canvas
  lng: number;
  shipmentsCount: number;
  throughput: string;
  connectedNodeIds: string[];
}

export interface SupplyRoute {
  id: string;
  fromId: string;
  toId: string;
  status: 'active' | 'delayed' | 'optimal';
  volume: string;
  transitTime: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
}

export type EventSeverity = 'critical' | 'warning' | 'resolved' | 'info';

export interface ExecutiveAttentionItem {
  id: string;
  severity: EventSeverity;
  title: string;
  explanation: string;
  timestamp: string;
  regionFilter?: string;
  statusFilter?: string;
  highlightedCardId?: string;
  highlightedNodeIds?: string[];
  highlightedRouteIds?: string[];
  actionLabel?: string;
}

export interface CommandFilterState {
  activeCommandText: string | null;
  activeExplanation: string | null;
  regionFilter?: string | null;
  statusFilter?: string | null;
  highlightedCardId?: string | null;
  highlightedNodeIds?: string[];
  highlightedRouteIds?: string[];
  activeEventId?: string | null;
  targetSectionId?: string | null;
  selectedShipmentId?: string | null;
  targetCategory?: string | null;
  isCompareMode?: boolean;
}
