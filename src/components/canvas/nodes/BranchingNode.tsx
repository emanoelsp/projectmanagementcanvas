"use client";

import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { PARADIGM_OPTIONS } from "@/lib/canvas-config";

interface BranchingNodeProps {
  data: {
    label: string;
    choice?: "A" | "B" | null;
    locked?: boolean;
  };
  id: string;
}

export function BranchingNode({ data, id }: BranchingNodeProps) {
  const { completeNode, setParadigmChoice, paradigmChoice } = useCanvasStore();

  const handleChoice = (choice: "A" | "B") => {
    setParadigmChoice(choice);
    completeNode(id, { choice });
  };

  if (data.locked) {
    return (
      <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 w-48 opacity-50">
        <Handle type="target" position={Position.Top} />
        <p className="text-xs font-medium text-slate-500 mb-2">🔒 Bloqueado</p>
        <p className="text-sm font-medium truncate">{data.label}</p>
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-4 w-72 shadow-sm">
      <Handle type="target" position={Position.Top} />

      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase">{data.label}</p>
      </div>

      <div className="space-y-3">
        {PARADIGM_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleChoice(option.value as "A" | "B")}
            className={`w-full p-3 rounded-lg border-2 transition-all ${
              paradigmChoice === option.value
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-sm font-medium text-left">{option.label}</p>
            <p className="text-xs text-slate-500 text-left">{option.description}</p>
          </button>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
