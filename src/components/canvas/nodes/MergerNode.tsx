"use client";

import { Handle, Position } from "reactflow";
import type { NodeStyle } from "@/stores/canvasStore";

interface MergerNodeProps {
  data: {
    label?: string;
    nodeStyle?: NodeStyle;
  };
}

export function MergerNode({ data }: MergerNodeProps) {
  const accent = data.nodeStyle?.fontColor ?? "#6366f1";

  return (
    <>
      {/* Two target handles — one per incoming edge */}
      <Handle type="target" position={Position.Top} id="left" style={{ left: "30%" }} />
      <Handle type="target" position={Position.Top} id="right" style={{ left: "70%" }} />

      <div
        className="flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-3 shadow-sm"
        style={{ borderColor: accent, minWidth: 200 }}
      >
        {/* Curly brace SVG */}
        <svg width="22" height="56" viewBox="0 0 22 56" fill="none" aria-hidden>
          <path
            d="M18,2 Q6,2 6,12 L6,22 Q6,28 2,28 Q6,28 6,34 L6,44 Q6,54 18,54"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div>
          <p className="text-xs font-bold" style={{ color: accent }}>Estratégia Unificada</p>
          <p className="text-[10px] text-slate-400">BMC + Proposta de Valor</p>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
