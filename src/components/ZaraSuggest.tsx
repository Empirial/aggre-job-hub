import { useState, useRef } from "react";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { agentApi } from "@/lib/api";
import { cn } from "@/lib/utils";

type SuggestState = "idle" | "loading" | "done" | "error";

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useZaraSuggest() {
  const [state, setState] = useState<SuggestState>("idle");
  const [suggestion, setSuggestion] = useState("");
  const applyRef = useRef<(v: string) => void>(() => {});

  const ask = async (prompt: string, onApply: (v: string) => void) => {
    applyRef.current = onApply;
    setState("loading");
    setSuggestion("");
    try {
      const res = await agentApi.send([{ role: "user", content: prompt }]);
      setSuggestion(res.reply);
      setState("done");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  const apply = () => {
    applyRef.current(suggestion);
    reset();
  };

  const reset = () => {
    setState("idle");
    setSuggestion("");
  };

  return { state, suggestion, ask, apply, dismiss: reset };
}

// ── Trigger button ────────────────────────────────────────────────────────────

interface TriggerProps {
  onClick: () => void;
  loading?: boolean;
  error?: boolean;
  label?: string;
  className?: string;
}

export function ZaraTrigger({ onClick, loading, error, label = "Ask Zara", className }: TriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      title={label}
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-medium transition-colors disabled:opacity-50",
        error ? "text-red-400" : "text-brand-500 hover:text-brand-700",
        className
      )}
    >
      {loading
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : <Sparkles className="w-3 h-3" />}
      {error ? "Failed" : label}
    </button>
  );
}

// ── Suggestion card ───────────────────────────────────────────────────────────

interface CardProps {
  suggestion: string;
  onApply: () => void;
  onDismiss: () => void;
  applyLabel?: string;
  maxLength?: number;
}

export function ZaraSuggestionCard({
  suggestion,
  onApply,
  onDismiss,
  applyLabel = "Use This",
  maxLength = 500,
}: CardProps) {
  const display = suggestion.length > maxLength
    ? suggestion.slice(0, maxLength) + "…"
    : suggestion;

  return (
    <div className="mt-2 border border-brand-200 bg-brand-50/60 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-brand-500" />
        <span className="text-[11px] font-semibold text-brand-600">Zara suggests</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{display}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          type="button"
          className="h-7 text-xs bg-brand-600 hover:bg-brand-700 text-white px-3"
          onClick={onApply}
        >
          <Check className="w-3 h-3 mr-1" />
          {applyLabel}
        </Button>
        <Button
          size="sm"
          type="button"
          variant="ghost"
          className="h-7 text-xs text-gray-500 px-2"
          onClick={onDismiss}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
