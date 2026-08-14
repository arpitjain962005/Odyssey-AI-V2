import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mic,
  ArrowUp,
  X,
  CornerDownLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Loader2,
  Zap,
} from 'lucide-react';
import { matchIntent } from '../utils/intentMatcher';
import { IntentMatchResult } from '../types/intent';
import { DEFAULT_SUGGESTED_QUESTIONS } from '../data/intentBank';

interface CommandBarProps {
  currentPage?: string;
  onExecuteCommand: (commandText: string, matchResult?: IntentMatchResult) => void;
  onClearCommand: () => void;
  activeCommand: string | null;
  activeExplanation: string | null;
}

export const SUGGESTED_PROMPTS = [
  'Which routes are most profitable?',
  'Show delayed shipments',
  'What needs my attention?',
  'How is revenue doing?',
  'Compare Singapore and Rotterdam',
  'Which cargo is growing?',
  'Give me a quick summary',
  'Show Smart Staff',
];

export const CommandBar: React.FC<CommandBarProps> = ({
  currentPage = 'dashboard',
  onExecuteCommand,
  onClearCommand,
  activeCommand,
  activeExplanation,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastMatchResult, setLastMatchResult] = useState<IntentMatchResult | null>(null);
  const [showResponseCard, setShowResponseCard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input text if activeCommand changes from outside
  useEffect(() => {
    if (!activeCommand) {
      setInputText('');
      setShowResponseCard(false);
      setLastMatchResult(null);
    }
  }, [activeCommand]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to focus, Escape to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (showResponseCard || activeCommand) {
          handleDismissResponse();
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResponseCard, activeCommand]);

  const executeWithIntent = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsProcessing(true);
    setInputText(trimmed);

    // Run local intent matcher
    const match = matchIntent(trimmed, currentPage);

    // Brief simulated analysis state for smooth UX
    setTimeout(() => {
      setLastMatchResult(match);
      setShowResponseCard(true);
      setIsProcessing(false);
      onExecuteCommand(trimmed, match);
    }, 240);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    executeWithIntent(inputText.trim());
  };

  const handleSuggestionClick = (prompt: string) => {
    executeWithIntent(prompt);
  };

  const handleDismissResponse = () => {
    setShowResponseCard(false);
    onClearCommand();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    setInputText('');
    setShowResponseCard(false);
    onClearCommand();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      const voicePrompts = [
        'Which routes are most profitable?',
        'Show delayed shipments',
        'What needs my attention?',
        'Compare Singapore and Rotterdam',
      ];
      const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];

      setTimeout(() => {
        setIsListening(false);
        executeWithIntent(randomPrompt);
      }, 1600);
    }
  };

  const getStatusBadge = () => {
    if (isListening) {
      return {
        label: 'Listening...',
        dotClass: 'bg-rose-400 animate-ping',
        textClass: 'text-rose-300',
      };
    }
    if (isProcessing) {
      return {
        label: 'Processing',
        dotClass: 'bg-amber-400 animate-pulse',
        textClass: 'text-amber-300',
      };
    }
    if (lastMatchResult) {
      if (lastMatchResult.matched) {
        return {
          label: 'Intent Recognized',
          dotClass: 'bg-emerald-400',
          textClass: 'text-emerald-300',
        };
      }
      return {
        label: 'Unrecognized',
        dotClass: 'bg-amber-400',
        textClass: 'text-amber-300',
      };
    }
    return {
      label: 'Ready',
      dotClass: 'bg-blue-400',
      textClass: 'text-slate-400',
    };
  };

  const status = getStatusBadge();

  return (
    <div
      id="odyssey-command-bar-container"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl z-50 flex flex-col items-center gap-2 pointer-events-auto transition-all"
    >
      {/* LAYER 1: Response Feedback Card (Pop-up above Command Bar) */}
      {showResponseCard && (
        <div className="w-full bg-[#0D121F]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl shadow-black/80 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
          {/* Header Row: User Query & Close */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono-code text-blue-400 font-medium shrink-0 uppercase tracking-wide">
                User Query
              </span>
              <span className="text-xs text-slate-200 font-medium truncate">
                "{inputText || activeCommand}"
              </span>
            </div>

            <button
              id="cmd-bar-close-response-btn"
              onClick={handleDismissResponse}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors shrink-0"
              title="Dismiss response (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body: Odyssey Response */}
          <div className="pt-3 space-y-3">
            {isProcessing ? (
              <div className="flex items-center gap-2.5 text-xs text-slate-300 py-1">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span>Analyzing intent and querying Odyssey intelligence...</span>
              </div>
            ) : lastMatchResult?.matched ? (
              /* MATCHED INTENT RESPONSE */
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-slate-200 font-medium leading-relaxed">
                      {lastMatchResult.responseMessage}
                    </div>
                    {lastMatchResult.intent && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-code text-[10px]">
                          {lastMatchResult.intent.name}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">
                          {lastMatchResult.action?.explanation || lastMatchResult.intent.description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Follow-up Suggested Prompts */}
                {lastMatchResult.suggestedPrompts && lastMatchResult.suggestedPrompts.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 mr-1">Follow-up:</span>
                    {lastMatchResult.suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSuggestionClick(prompt)}
                        className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-blue-600/20 border border-slate-700/60 hover:border-blue-500/40 text-[11px] text-slate-300 hover:text-blue-300 transition-all font-medium"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* UNRECOGNIZED INTENT FALLBACK */
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-amber-200 font-medium">
                      I couldn't recognize that yet.
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Try asking something like:
                    </div>
                  </div>
                </div>

                {/* 3-4 Clickable Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(lastMatchResult?.suggestedPrompts || DEFAULT_SUGGESTED_QUESTIONS).map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="px-3 py-1.5 rounded-lg bg-[#141C2E] hover:bg-blue-600/20 border border-slate-700/80 hover:border-blue-500/60 text-xs text-slate-200 hover:text-blue-300 transition-all font-medium shadow-xs text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LAYER 2: Suggested Prompt Chips (When response card is closed) */}
      {!showResponseCard && (
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 no-scrollbar px-1">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSuggestionClick(prompt)}
              className="px-3 py-1 rounded-full bg-[#0E1422]/90 hover:bg-[#1A2338] border border-slate-800/80 hover:border-blue-500/40 text-[11px] text-slate-400 hover:text-slate-200 transition-all shrink-0 font-medium shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* LAYER 3: Main AI Command Bar Input */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-[#0D121F]/95 backdrop-blur-xl border border-slate-700/70 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:shadow-xl focus-within:shadow-blue-500/10 rounded-2xl p-2 pl-3.5 flex items-center gap-2.5 transition-all duration-200 shadow-2xl shadow-black/80"
      >
        {/* Left Sparkle Icon + Status Badge */}
        <div className="flex items-center gap-2 shrink-0 border-r border-slate-800 pr-2.5">
          <Sparkles className="w-4 h-4 text-blue-400" />

          {/* Integrated Status Indicator Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#141C2E] border border-slate-700/60 text-[10px] font-mono-code font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
            <span className={`tracking-tight ${status.textClass}`}>{status.label}</span>
          </div>
        </div>

        {/* Command Input Field */}
        <input
          ref={inputRef}
          id="odyssey-command-bar-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='Ask Odyssey in natural language... (e.g. "Which routes are most profitable?")'
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
        />

        {/* Keyboard shortcut hint */}
        {!inputText && (
          <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-400 font-mono-code border border-slate-700/50 shrink-0">
            ⌘K
          </span>
        )}

        {/* Right Controls: Clear, Mic, Submit */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(inputText || activeCommand) && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleMic}
            className={`p-2 rounded-xl transition-colors relative ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title={isListening ? 'Listening...' : 'Voice command'}
          >
            <Mic className="w-4 h-4" />
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          <button
            id="cmd-bar-submit-btn"
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className={`p-2 rounded-xl transition-all ${
              inputText.trim() && !isProcessing
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 cursor-pointer'
                : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
            }`}
            title="Execute Command"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
