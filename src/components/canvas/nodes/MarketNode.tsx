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
  const { completeNode, updateNodeData, paradigmChoice } = useCanvasStore();
  const fontColor = data.nodeStyle?.fontColor ?? "#64748b";

  const handleSave = () => {
    if (audience.trim() || inspiration.trim() || competitor.trim()) {
      const nextData = { ...data, audience, inspiration, competitor };
      if (audience.trim()) completeNode(id, nextData);
      else updateNodeData(id, nextData);
      setIsEditing(false);
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={380} minHeight={160}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase" style={{ color: fontColor }}>{data.label}</p>
          {data.description && <InfoTooltip text={data.description} />}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: fontColor }}>
                  Público-alvo
                </label>
                <textarea
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  placeholder="Ex: Professores do ensino público..."
                  className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px] resize-none"
                  style={{ color: fontColor }}
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: fontColor }}>
                  {paradigmChoice === "B" ? "Concorrente Principal" : "Inspiração (Schumpeteriana)"}
                </label>
                {paradigmChoice === "B" ? (
                  <textarea
                    value={competitor}
                    onChange={e => setCompetitor(e.target.value)}
                    placeholder="Ex: Principal concorrente..."
                    className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px] resize-none"
                    style={{ color: fontColor }}
                  />
                ) : (
                  <textarea
                    value={inspiration}
                    onChange={e => setInspiration(e.target.value)}
                    placeholder="Ex: Referência inspiradora..."
                    className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px] resize-none"
                    style={{ color: fontColor }}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1">Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
            </div>
          </div>
        ) : (
          <div>
            {audience || inspiration || competitor ? (
              <div className="grid grid-cols-2 gap-3 mb-3 p-2 bg-white/50 rounded min-h-[60px] break-words text-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase opacity-70 mb-0.5" style={{ color: fontColor }}>
                    Público-alvo
                  </p>
                  <p style={{ color: fontColor }}>
                    {audience || <span className="opacity-50 italic">Não preenchido</span>}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase opacity-70 mb-0.5" style={{ color: fontColor }}>
                    {paradigmChoice === "B" ? "Concorrente Principal" : "Inspiração (Schumpeteriana)"}
                  </p>
                  <p style={{ color: fontColor }}>
                    {(paradigmChoice === "B" ? competitor : inspiration) || (
                      <span className="opacity-50 italic">Não preenchido</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm mb-3 p-2 bg-white/30 rounded min-h-[60px] opacity-60 flex items-center justify-center" style={{ color: fontColor }}>
                Clique para preencher
              </div>
            )}
            <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              {audience || inspiration || competitor ? "Editar" : "Preencher"}
            </Button>
          </div>
        )}
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
