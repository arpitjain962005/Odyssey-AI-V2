export type IntentCategory = 'journeys' | 'rising' | 'falling' | 'revenue' | 'general';

export interface IntentDefinition {
  id: string;
  name: string;
  category: IntentCategory;
  description: string;
  examples: string[];
  keywords: string[];
  patterns?: RegExp[];
  actionType: 'navigate' | 'filter' | 'highlight' | 'compare' | 'select_shipment' | 'summary';
  targetNavId?: string;
  targetFilter?: Record<string, any>;
  targetSectionId?: string;
  defaultResponse: string;
  suggestedFollowUps?: string[];
}

export interface IntentMatchResult {
  matched: boolean;
  intent?: IntentDefinition;
  confidence: number;
  extractedParams?: {
    shipmentId?: string;
    routeQuery?: string;
    customerName?: string;
    corridorName?: string;
    category?: string;
  };
  responseMessage: string;
  suggestedPrompts: string[];
  action?: {
    type: 'navigate' | 'filter' | 'highlight' | 'compare' | 'select_shipment' | 'summary';
    navId?: string;
    filters?: Record<string, any>;
    sectionId?: string;
    shipmentId?: string;
    explanation?: string;
  };
}

export interface CommandHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  intentId?: string;
  matched: boolean;
  response: string;
  actionSummary?: string;
}
