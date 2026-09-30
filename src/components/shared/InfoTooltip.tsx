"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="text-slate-400 hover:text-blue-500 transition-colors"
      >
        <HelpCircle size={13} />
      </button>
      {open && (
        <div className="absolute right-0 top-5 z-[9999] w-72 bg-white border border-slate-200 rounded-lg p-3 shadow-xl text-xs text-slate-600 leading-relaxed whitespace-pre-line">
          {text}
        </div>
      )}
    </div>
  );
}
