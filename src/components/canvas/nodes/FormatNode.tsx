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

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={240} minHeight={150}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase" style={{ color: fontColor }}>{data.label}</p>
          {data.description && <InfoTooltip text={data.description} />}
        </div>

        {isEditing ? (
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {[
              { title: "Formato de Negócio", opts: BUSINESS_FORMATS, state: businessFormat, type: "business" as const },
              { title: "Formas de Receita", opts: REVENUE_FORMATS, state: revenueFormats, type: "revenue" as const },
            ].map(g => (
              <div key={g.title}>
                <label className="text-xs font-medium block mb-1" style={{ color: fontColor }}>{g.title}</label>
                <div className="space-y-1">
                  {g.opts.map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={g.state.includes(opt)} onChange={() => toggle(opt, g.type)} className="w-3.5 h-3.5" />
                      <span className="text-sm" style={{ color: fontColor }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1">Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
            </div>
          </div>
        ) : (
          <div>
            {businessFormat.length > 0 && revenueFormats.length > 0 ? (
              <div className="text-sm mb-2 p-2 bg-white/50 rounded space-y-1">
                <div className="flex flex-wrap gap-1">
                  {businessFormat.map(f => <span key={f} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{f}</span>)}
                  {revenueFormats.map(f => <span key={f} className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{f}</span>)}
                </div>
              </div>
            ) : (
              <div className="text-sm mb-2 p-2 bg-white/30 rounded min-h-[50px] opacity-60" style={{ color: fontColor }}>Clique para selecionar formatos</div>
            )}
            <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              {businessFormat.length > 0 ? "Editar" : "Preencher"}
            </Button>
          </div>
        )}
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
