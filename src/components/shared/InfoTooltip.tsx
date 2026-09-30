"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { HelpCircle } from "lucide-react";

const PANEL_WIDTH = 288;
const GAP = 6;
const VIEWPORT_PAD = 8;

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updateCoords = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const panelHeight = panelRef.current?.offsetHeight ?? 0;
    const maxLeft = window.innerWidth - PANEL_WIDTH - VIEWPORT_PAD;
    const left = Math.min(Math.max(VIEWPORT_PAD, rect.right - PANEL_WIDTH), maxLeft);
    const below = rect.bottom + GAP;
    const above = rect.top - GAP - panelHeight;
    const fitsBelow = below + panelHeight <= window.innerHeight - VIEWPORT_PAD;
    const top = !fitsBelow && above > VIEWPORT_PAD ? above : below;
    setCoords({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updateCoords();
  }, [open, updateCoords, text]);

  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const tick = () => {
      updateCoords();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, updateCoords]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Ajuda"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="nodrag nopan text-slate-400 hover:text-blue-500 transition-colors"
      >
        <HelpCircle size={13} />
      </button>
      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: PANEL_WIDTH,
              zIndex: 50,
            }}
            className="nodrag nopan max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-xl whitespace-pre-line"
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}
