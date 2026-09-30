"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { BUSINESS_FORMATS, REVENUE_FORMATS } from "@/lib/canvas-config";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

interface FormatNodeProps {
  data: {
    label: string;
    businessFormat?: string[];
    revenueFormats?: string[];
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function FormatNode({ data, id }: FormatNodeProps) {
  const [businessFormat, setBusinessFormat] = useState<string[]>(data.businessFormat || []);
  const [revenueFormats, setRevenueFormats] = useState<string[]>(data.revenueFormats || []);
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode } = useCanvasStore();
  const fontColor = data.nodeStyle?.fontColor ?? "#64748b";

  const toggle = (val: string, type: "business" | "revenue") => {
    if (type === "business") setBusinessFormat(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);
    else setRevenueFormats(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);
  };

  const handleSave = () => {
    if (businessFormat.length > 0 && revenueFormats.length > 0) {
      completeNode(id, { ...data, businessFormat, revenueFormats });
      setIsEditing(false);
    }
  };

  const isFilled = businessFormat.length > 0 && revenueFormats.length > 0;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={340} minHeight={200}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase" style={{ color: fontColor }}>{data.label}</p>
          {data.description && <InfoTooltip text={data.description} />}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            {/* Layout lado a lado */}
            <div className="grid grid-cols-2 gap-3">
              {/* Formato de Negócio */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-blue-700 mb-2">Formato de Negócio</p>
                <div className="space-y-1.5">
                  {BUSINESS_FORMATS.map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={businessFormat.includes(opt)}
                        onChange={() => toggle(opt, "business")}
                        className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-sm group-hover:text-blue-700 transition-colors" style={{ color: fontColor }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Formas de Receita */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-emerald-700 mb-2">Formas de Receita</p>
                <div className="space-y-1.5">
                  {REVENUE_FORMATS.map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={revenueFormats.includes(opt)}
                        onChange={() => toggle(opt, "revenue")}
                        className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
                      />
                      <span className="text-sm group-hover:text-emerald-700 transition-colors" style={{ color: fontColor }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1">Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
            </div>
          </div>
        ) : (
          <div>
            {isFilled ? (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <p className="text-xs font-semibold text-blue-700 mb-1.5">Formato de Negócio</p>
                  <div className="flex flex-wrap gap-1">
                    {businessFormat.map(f => (
                      <span key={f} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                  <p className="text-xs font-semibold text-emerald-700 mb-1.5">Formas de Receita</p>
                  <div className="flex flex-wrap gap-1">
                    {revenueFormats.map(f => (
                      <span key={f} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-2 opacity-40">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Formato de Negócio</p>
                  <p className="text-xs text-slate-400">Clique para selecionar</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Formas de Receita</p>
                  <p className="text-xs text-slate-400">Clique para selecionar</p>
                </div>
              </div>
            )}
            <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              {isFilled ? "Editar" : "Preencher"}
            </Button>
          </div>
        )}
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
