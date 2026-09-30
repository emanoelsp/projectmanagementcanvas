"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

interface MarketNodeProps {
  data: {
    label: string;
    audience?: string;
    inspiration?: string;
    competitor?: string;
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
  const fontColor = data.nodeStyle?.fontColor ?? "#64748b";

  const handleSave = () => {
    if (audience.trim()) {
      completeNode(id, { ...data, audience, inspiration, competitor });
      setIsEditing(false);
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={220} minHeight={150}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase" style={{ color: fontColor }}>{data.label}</p>
          {data.description && <InfoTooltip text={data.description} />}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium" style={{ color: fontColor }}>Público-alvo</label>
              <textarea value={audience} onChange={e => setAudience(e.target.value)}
                placeholder="Descreva em uma frase..."
                className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[50px] mt-1" />
            </div>
            {paradigmChoice === "A" && (
              <div>
                <label className="text-xs font-medium" style={{ color: fontColor }}>Inspiração (Schumpeteriana)</label>
                <textarea value={inspiration} onChange={e => setInspiration(e.target.value)}
                  placeholder="Qual é a inspiração disso?"
                  className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[50px] mt-1" />
              </div>
            )}
            {paradigmChoice === "B" && (
              <div>
                <label className="text-xs font-medium" style={{ color: fontColor }}>Concorrente Principal</label>
                <textarea value={competitor} onChange={e => setCompetitor(e.target.value)}
                  placeholder="Qual é o principal concorrente?"
                  className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[50px] mt-1" />
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
              <div className="text-sm mb-2 p-2 bg-white/50 rounded space-y-1 min-h-[50px] break-words">
                <p style={{ color: fontColor }}><span className="font-medium text-xs">Público: </span>{audience}</p>
                {paradigmChoice === "A" && inspiration && <p style={{ color: fontColor }}><span className="font-medium text-xs">Inspiração: </span>{inspiration}</p>}
                {paradigmChoice === "B" && competitor && <p style={{ color: fontColor }}><span className="font-medium text-xs">Concorrente: </span>{competitor}</p>}
              </div>
            ) : (
              <div className="text-sm mb-2 p-2 bg-white/30 rounded min-h-[50px] opacity-60" style={{ color: fontColor }}>Clique para preencher</div>
            )}
            <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              {audience ? "Editar" : "Preencher"}
            </Button>
          </div>
        )}
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
