"use client";

import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { PARADIGM_OPTIONS } from "@/lib/canvas-config";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import type { NodeStyle } from "@/stores/canvasStore";

interface BranchingNodeProps {
  data: {
    label: string;
    choice?: "A" | "B" | null;
    locked?: boolean;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function BranchingNode({ data, id }: BranchingNodeProps) {
  const { completeNode, setParadigmChoice, paradigmChoice } = useCanvasStore();

  const handleChoice = (choice: "A" | "B") => {
    setParadigmChoice(choice);
    completeNode(id, { ...data, choice });
  };

  const style = data.nodeStyle;
  const containerStyle = style
    ? { backgroundColor: style.bgColor, borderColor: style.borderColor, borderRadius: style.borderRadius }
    : {};

  return (
    <div className="border-2 p-4 w-72 shadow-sm" style={{ ...containerStyle, borderStyle: "solid" }}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase">{data.label}</p>
        {data.description && <InfoTooltip text={data.description} />}
      </div>

      <div className="space-y-3">
        {PARADIGM_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleChoice(option.value as "A" | "B")}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              paradigmChoice === option.value
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-sm font-medium">{option.label}</p>
            <p className="text-xs text-slate-500">{option.description}</p>
          </button>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
