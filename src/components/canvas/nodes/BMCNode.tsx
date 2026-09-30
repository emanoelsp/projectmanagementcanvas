"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

const BMC_FIELDS = [
  { key: "keyPartners", label: "Parceiros-Chave" },
  { key: "keyActivities", label: "Atividades-Chave" },
  { key: "keyResources", label: "Recursos-Chave" },
  { key: "valueProposition", label: "Proposta de Valor" },
  { key: "customerSegments", label: "Segmentos de Cliente" },
  { key: "customerRelationships", label: "Relacionamento com Cliente" },
  { key: "channels", label: "Canais" },
  { key: "costStructure", label: "Estrutura de Custos" },
  { key: "revenueStreams", label: "Fluxos de Receita" },
];

interface BMCNodeProps {
  data: {
    label: string;
    keyPartners?: string; keyActivities?: string; keyResources?: string;
    valueProposition?: string; customerSegments?: string; customerRelationships?: string;
    channels?: string; costStructure?: string; revenueStreams?: string;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function BMCNode({ data, id }: BMCNodeProps) {
  const [fields, setFields] = useState({
    keyPartners: data.keyPartners || "", keyActivities: data.keyActivities || "",
    keyResources: data.keyResources || "", valueProposition: data.valueProposition || "",
    customerSegments: data.customerSegments || "", customerRelationships: data.customerRelationships || "",
    channels: data.channels || "", costStructure: data.costStructure || "", revenueStreams: data.revenueStreams || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode } = useCanvasStore();
  const fontColor = data.nodeStyle?.fontColor ?? "#64748b";
  const filledCount = Object.values(fields).filter(v => v.trim().length > 0).length;

  const handleSave = () => {
    if (filledCount >= 5) {
      completeNode(id, { ...data, ...fields });
      setIsEditing(false);
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={300} minHeight={200}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase" style={{ color: fontColor }}>{data.label}</p>
          {data.description && <InfoTooltip text={data.description} />}
        </div>

        {isEditing ? (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {BMC_FIELDS.map(field => (
              <div key={field.key}>
                <label className="text-xs font-medium block mb-0.5" style={{ color: fontColor }}>{field.label}</label>
                <textarea
                  value={fields[field.key as keyof typeof fields]}
                  onChange={e => setFields(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder="Descreva..."
                  className="w-full p-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[35px]"
                />
              </div>
            ))}
            <div className="flex gap-2 sticky bottom-0 bg-white/80 pt-1">
              <Button size="sm" onClick={handleSave} className="flex-1">Salvar ({filledCount}/9)</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
            </div>
          </div>
        ) : (
          <div>
            {filledCount > 0 ? (
              <div className="text-xs mb-2 p-2 bg-white/50 rounded grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto">
                {BMC_FIELDS.map(field => fields[field.key as keyof typeof fields] && (
                  <div key={field.key} className="border-l-2 border-blue-400 pl-1.5">
                    <p className="font-medium" style={{ color: fontColor }}>{field.label}</p>
                    <p className="line-clamp-2" style={{ color: fontColor }}>{fields[field.key as keyof typeof fields]}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs mb-2 p-2 bg-white/30 rounded opacity-60" style={{ color: fontColor }}>Preencha pelo menos 5 campos do BMC</div>
            )}
            <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              {filledCount > 0 ? `Editar (${filledCount}/9)` : "Preencher"}
            </Button>
          </div>
        )}
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
