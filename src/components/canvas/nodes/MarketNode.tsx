"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import type { NodeStyle } from "@/stores/canvasStore";

interface MarketNodeProps {
  data: {
    label: string;
    audience?: string;
    inspiration?: string;
    competitor?: string;
    locked?: boolean;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function MarketNode({ data, id }: MarketNodeProps) {
  const [audience, setAudience] = useState(data.audience || "");
  const [inspiration, setInspiration] = useState(data.inspiration || "");
  const [competitor, setCompetitor] = useState(data.competitor || "");
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode, paradigmChoice } = useCanvasStore();

  const handleSave = () => {
    if (audience.trim()) {
      completeNode(id, { ...data, audience, inspiration, competitor });
      setIsEditing(false);
    }
  };

  const style = data.nodeStyle;
  const containerStyle = style
    ? { backgroundColor: style.bgColor, borderColor: style.borderColor, borderRadius: style.borderRadius }
    : {};

  return (
    <div className="border-2 p-4 w-72 shadow-sm hover:shadow-md transition-shadow" style={{ ...containerStyle, borderStyle: "solid" }}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase">{data.label}</p>
        {data.description && <InfoTooltip text={data.description} />}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Público-alvo</label>
            <textarea
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Descreva em uma frase..."
              className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] mt-1"
            />
          </div>

          {paradigmChoice === "A" && (
            <div>
              <label className="text-xs font-medium text-slate-600">Inspiração (Schumpeteriana)</label>
              <textarea
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
                placeholder="Qual é a inspiração disso?"
                className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] mt-1"
              />
            </div>
          )}

          {paradigmChoice === "B" && (
            <div>
              <label className="text-xs font-medium text-slate-600">Concorrente Principal</label>
              <textarea
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                placeholder="Qual é o principal concorrente?"
                className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] mt-1"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="flex-1">Salvar</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
          </div>
        </div>
      ) : (
        <div>
          {audience ? (
            <div className="text-sm text-slate-700 mb-3 p-2 bg-slate-50 rounded min-h-[60px] break-words space-y-1">
              <p><span className="font-medium text-xs text-slate-600">Público-alvo: </span>{audience}</p>
              {paradigmChoice === "A" && inspiration && <p><span className="font-medium text-xs text-slate-600">Inspiração: </span>{inspiration}</p>}
              {paradigmChoice === "B" && competitor && <p><span className="font-medium text-xs text-slate-600">Concorrente: </span>{competitor}</p>}
            </div>
          ) : (
            <div className="text-sm text-slate-400 mb-3 p-2 bg-slate-50 rounded min-h-[60px]">Clique para preencher</div>
          )}
          <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
            {audience ? "Editar" : "Preencher"}
          </Button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
