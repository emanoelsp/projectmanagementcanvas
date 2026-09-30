"use client";

import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { PARADIGM_OPTIONS } from "@/lib/canvas-config";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

interface BranchingNodeProps {
  data: {
    label: string;
    choice?: "A" | "B" | null;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function BranchingNode({ data, id }: BranchingNodeProps) {
  const { completeNode, setParadigmChoice, paradigmChoice } = useCanvasStore();
  const fontColor = data.nodeStyle?.fontColor ?? "#64748b";

  const handleChoice = (choice: "A" | "B") => {
    setParadigmChoice(choice);
    completeNode(id, { ...data, choice });
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={220} minHeight={160}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase" style={{ color: fontColor }}>{data.label}</p>
          {data.description && <InfoTooltip text={data.description} />}
        </div>
        <div className="space-y-2">
          {PARADIGM_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleChoice(option.value as "A" | "B")}
              className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
                paradigmChoice === option.value ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-medium" style={{ color: fontColor }}>{option.label}</p>
              <p className="text-xs text-slate-500">{option.description}</p>
            </button>
          ))}
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="right" />
    </>
  );
}
