"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { INNOVATION_TYPE_OPTIONS } from "@/lib/canvas-config";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

interface InnovationTypeNodeProps {
  data: {
    label: string;
    choice?: "fechada" | "aberta" | null;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function InnovationTypeNode({ data, id }: InnovationTypeNodeProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(data.choice || null);
  const { completeNode } = useCanvasStore();
  const fontColor = data.nodeStyle?.fontColor ?? "#64748b";

  const handleSelect = (choice: "fechada" | "aberta") => {
    setSelectedChoice(choice);
    completeNode(id, { ...data, choice });
  };

  return (
    <>
      <Handle type="target" position={Position.Left} id="left" />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={260} minHeight={170}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase" style={{ color: fontColor }}>{data.label}</p>
          {data.description && <InfoTooltip text={data.description} />}
        </div>

        <div className="space-y-2">
          {INNOVATION_TYPE_OPTIONS.map(option => {
            const isSelected = selectedChoice === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value as "fechada" | "aberta")}
                className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/70 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: isSelected ? "#2563eb" : fontColor }}>
                    {option.label}
                  </p>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{option.description}</p>
              </button>
            );
          })}
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} id="right" />
    </>
  );
}
