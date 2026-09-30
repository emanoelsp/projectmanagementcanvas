"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { BUSINESS_FORMATS, REVENUE_FORMATS } from "@/lib/canvas-config";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import type { NodeStyle } from "@/stores/canvasStore";

interface FormatNodeProps {
  data: {
    label: string;
    businessFormat?: string[];
    revenueFormats?: string[];
    locked?: boolean;
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

  const style = data.nodeStyle;
  const containerStyle = style
    ? { backgroundColor: style.bgColor, borderColor: style.borderColor, borderRadius: style.borderRadius }
    : {};

  return (
    <div className="border-2 p-4 w-80 shadow-sm hover:shadow-md transition-shadow" style={{ ...containerStyle, borderStyle: "solid" }}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase">{data.label}</p>
        {data.description && <InfoTooltip text={data.description} />}
      </div>

      {isEditing ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {[
            { title: "Formato de Negócio", opts: BUSINESS_FORMATS, state: businessFormat, type: "business" as const },
            { title: "Formas de Receita", opts: REVENUE_FORMATS, state: revenueFormats, type: "revenue" as const },
          ].map(group => (
            <div key={group.title}>
              <label className="text-xs font-medium text-slate-600 block mb-2">{group.title}</label>
              <div className="space-y-1">
                {group.opts.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={group.state.includes(opt)} onChange={() => toggle(opt, group.type)} className="w-4 h-4" />
                    <span className="text-sm">{opt}</span>
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
            <div className="text-sm mb-3 p-2 bg-slate-50 rounded space-y-2">
              <div>
                <p className="font-medium text-xs text-slate-600 mb-1">Formato:</p>
                <div className="flex flex-wrap gap-1">
                  {businessFormat.map(f => <span key={f} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{f}</span>)}
                </div>
              </div>
              <div>
                <p className="font-medium text-xs text-slate-600 mb-1">Receita:</p>
                <div className="flex flex-wrap gap-1">
                  {revenueFormats.map(f => <span key={f} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{f}</span>)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 mb-3 p-2 bg-slate-50 rounded">Clique para selecionar formatos</div>
          )}
          <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
            {businessFormat.length > 0 ? "Editar" : "Preencher"}
          </Button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
