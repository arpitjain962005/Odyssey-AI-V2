import { SUPPORTED_INTENTS, DEFAULT_SUGGESTED_QUESTIONS } from '../data/intentBank';
import { IntentDefinition, IntentMatchResult } from '../types/intent';
import { MOCK_JOURNEYS } from '../data/mockJourneys';

// Helper to normalize strings for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Tokenize text into words
function tokenize(text: string): string[] {
  return normalizeText(text).split(' ').filter(Boolean);
}

// Extract shipment reference or container number if present
function extractShipmentReference(rawText: string): { shipmentId?: string; exists: boolean; formattedTitle?: string } {
  const upper = rawText.toUpperCase();
  
  // 1. Check known mock journey IDs directly (e.g. ODY-9842-SEA, ODY-5298-SEA, etc.)
  for (const j of MOCK_JOURNEYS) {
    if (upper.includes(j.id) || upper.includes(j.id.replace('-SEA', '').replace('-AIR', '').replace('-RAIL', '').replace('-ROAD', ''))) {
      return { shipmentId: j.id, exists: true, formattedTitle: `${j.id} (${j.title})` };
    }
    // Check container numbers
    if (j.containerNumbers && j.containerNumbers.some((c) => upper.includes(c.toUpperCase()))) {
      return { shipmentId: j.id, exists: true, formattedTitle: `${j.id} (Container in ${j.carrier})` };
    }
  }

  // 2. Regex for OD-XXXX or ODY-XXXX or general shipment references
  const match = rawText.match(/\b(OD|ODY|SHP)[ -]?(\d{3,5})(?:-([A-Z]+))?\b/i);
  if (match) {
    const rawId = match[0].toUpperCase().replace(/\s+/g, '-');
    // Check if partial match in mock
    const found = MOCK_JOURNEYS.find((j) => j.id.toUpperCase().includes(rawId) || rawId.includes(j.id.substring(0, 8)));
    if (found) {
      return { shipmentId: found.id, exists: true, formattedTitle: `${found.id} (${found.title})` };
    }
    return { shipmentId: rawId, exists: false };
  }

  // 3. Fallback for "OD-2048" or "2048"
  if (rawText.toLowerCase().includes('2048') || rawText.toLowerCase().includes('od-2048')) {
    // Map OD-2048 to first journey for rich demo preview or flag as specific
    const fallbackJourney = MOCK_JOURNEYS[0];
    return { shipmentId: 'OD-2048', exists: true, formattedTitle: `OD-2048 (${fallbackJourney.title})` };
  }

  return { exists: false };
}

/**
 * Main Intent Matcher
 * Matches user natural-language queries against predefined intent bank
 */
export function matchIntent(rawInput: string, currentPage: string = 'dashboard'): IntentMatchResult {
  const trimmed = rawInput.trim();

  // 1. Handle Empty Input
  if (!trimmed) {
    return {
      matched: false,
      confidence: 0,
      responseMessage: "I couldn't recognize that yet.",
      suggestedPrompts: DEFAULT_SUGGESTED_QUESTIONS,
    };
  }

  const normalized = normalizeText(trimmed);
  const userTokens = tokenize(normalized);

  // 2. Check for Specific Shipment ID Lookup
  const shipmentInfo = extractShipmentReference(trimmed);
  if (shipmentInfo.shipmentId) {
    const specificIntent = SUPPORTED_INTENTS.find((i) => i.id === 'specific_shipment')!;
    
    if (shipmentInfo.exists) {
      return {
        matched: true,
        intent: specificIntent,
        confidence: 0.98,
        extractedParams: { shipmentId: shipmentInfo.shipmentId },
        responseMessage: `Located shipment ${shipmentInfo.shipmentId}. Displaying real-time journey details and live satellite track.`,
        suggestedPrompts: specificIntent.suggestedFollowUps || DEFAULT_SUGGESTED_QUESTIONS,
        action: {
          type: 'select_shipment',
          navId: 'journeys',
          shipmentId: shipmentInfo.shipmentId,
          explanation: `Inspecting shipment ${shipmentInfo.shipmentId}`,
        },
      };
    } else {
      return {
        matched: true,
        intent: specificIntent,
        confidence: 0.90,
        extractedParams: { shipmentId: shipmentInfo.shipmentId },
        responseMessage: `Shipment ${shipmentInfo.shipmentId} was not found in active database. Displaying active global journeys catalog.`,
        suggestedPrompts: [
          'Show delayed shipments',
          'Show shipment ODY-9842-SEA',
          'What journeys are risky?',
        ],
        action: {
          type: 'navigate',
          navId: 'journeys',
          explanation: `Searched for ${shipmentInfo.shipmentId} in active fleet`,
        },
      };
    }
  }

  // 3. Score all supported intents
  let bestIntent: IntentDefinition | null = null;
  let bestScore = 0;

  for (const intent of SUPPORTED_INTENTS) {
    let score = 0;

    // Check exact example match (or substring in example)
    for (const example of intent.examples) {
      const normExample = normalizeText(example);
      if (normalized === normExample) {
        score = Math.max(score, 1.0);
        break;
      }
      if (normalized.includes(normExample) || normExample.includes(normalized)) {
        // High partial match
        const lenRatio = Math.min(normalized.length, normExample.length) / Math.max(normalized.length, normExample.length);
        score = Math.max(score, 0.75 + 0.2 * lenRatio);
      }
    }

    // Check multi-word phrase matching
    for (const kw of intent.keywords) {
      const normKw = normalizeText(kw);
      if (normalized.includes(normKw)) {
        const isMultiWord = normKw.includes(' ');
        score = Math.max(score, isMultiWord ? 0.85 : 0.65);
      }
    }

    // Check token overlap
    let tokenMatches = 0;
    const allIntentWords = new Set<string>();
    intent.keywords.forEach((k) => tokenize(k).forEach((w) => allIntentWords.add(w)));
    intent.examples.forEach((e) => tokenize(e).forEach((w) => allIntentWords.add(w)));

    for (const token of userTokens) {
      if (allIntentWords.has(token)) {
        tokenMatches++;
      }
    }

    if (userTokens.length > 0) {
      const tokenScore = (tokenMatches / userTokens.length) * 0.6;
      score = Math.max(score, tokenScore);
    }

    // Context boost if current page aligns with the intent category
    if (intent.targetNavId === currentPage && score >= 0.4) {
      score += 0.05;
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  // 4. Threshold Evaluation (0.38 for confident classification)
  if (bestIntent && bestScore >= 0.38) {
    // Generate context-aware response
    let responseText = bestIntent.defaultResponse;
    
    // Customize response if already on the target page
    if (currentPage === bestIntent.targetNavId && bestIntent.actionType === 'filter') {
      if (bestIntent.id === 'delayed_shipments') {
        responseText = 'Filtered Journeys view to delayed shipments.';
      } else if (bestIntent.id === 'risky_journeys') {
        responseText = 'Filtered Journeys view to critical high-risk shipments.';
      } else if (bestIntent.id === 'active_shipments') {
        responseText = 'Filtered Journeys view to all active shipments.';
      }
    }

    return {
      matched: true,
      intent: bestIntent,
      confidence: Math.min(1, Math.round(bestScore * 100) / 100),
      responseMessage: responseText,
      suggestedPrompts: bestIntent.suggestedFollowUps && bestIntent.suggestedFollowUps.length > 0
        ? bestIntent.suggestedFollowUps
        : DEFAULT_SUGGESTED_QUESTIONS,
      action: {
        type: bestIntent.actionType,
        navId: bestIntent.targetNavId,
        filters: bestIntent.targetFilter,
        sectionId: bestIntent.targetSectionId,
        explanation: `${bestIntent.name}: ${bestIntent.description}`,
      },
    };
  }

  // 5. Unrecognized Query Fallback
  // Pick 3-4 suggestions that might loosely relate to any token, or fallback to default top questions
  let fallbackPrompts = DEFAULT_SUGGESTED_QUESTIONS;
  
  if (userTokens.some((t) => ['route', 'lane', 'sea', 'shipping', 'transit'].includes(t))) {
    fallbackPrompts = [
      'Which routes are most profitable?',
      'Which routes are growing fastest?',
      'Show delayed shipments',
      'Compare Singapore and Rotterdam',
    ];
  } else if (userTokens.some((t) => ['money', 'dollar', 'cost', 'spend', 'earn'].includes(t))) {
    fallbackPrompts = [
      'How is revenue doing?',
      'Where are costs increasing?',
      'Which customer is most profitable?',
      'How much profit are we making?',
    ];
  } else if (userTokens.some((t) => ['problem', 'danger', 'fail', 'bad', 'issue'].includes(t))) {
    fallbackPrompts = [
      'What needs my attention?',
      'What are the biggest risks?',
      'Show delayed shipments',
      'Who can help me analyze a route?',
    ];
  }

  return {
    matched: false,
    confidence: Math.round(bestScore * 100) / 100,
    responseMessage: "I couldn't recognize that yet.",
    suggestedPrompts: fallbackPrompts,
  };
}
