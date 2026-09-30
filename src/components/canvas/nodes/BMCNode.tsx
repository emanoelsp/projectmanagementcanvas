"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
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
    keyPartners?: string;
    keyActivities?: string;
    keyResources?: string;
    valueProposition?: string;
    customerSegments?: string;
    customerRelationships?: string;
    channels?: string;
    costStructure?: string;
    revenueStreams?: string;
    locked?: boolean;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function BMCNode({ data, id }: BMCNodeProps) {
  const [fields, setFields] = useState({
    keyPartners: data.keyPartners || "",
    keyActivities: data.keyActivities || "",
    keyResources: data.keyResources || "",
    valueProposition: data.valueProposition || "",
    customerSegments: data.customerSegments || "",
    customerRelationships: data.customerRelationships || "",
    channels: data.channels || "",
    costStructure: data.costStructure || "",
    revenueStreams: data.revenueStreams || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode } = useCanvasStore();

  const handleSave = () => {
    const filledCount = Object.values(fields).filter(v => v.trim().length > 0).length;
    if (filledCount >= 5) {
      completeNode(id, { ...data, ...fields });
      setIsEditing(false);
    }
  };

  const filledCount = Object.values(fields).filter(v => v.trim().length > 0).length;

  const style = data.nodeStyle;
  const containerStyle = style
    ? { backgroundColor: style.bgColor, borderColor: style.borderColor, borderRadius: style.borderRadius }
    : {};

  return (
    <div className="border-2 p-4 w-96 max-h-96 overflow-y-auto shadow-sm hover:shadow-md transition-shadow" style={{ ...containerStyle, borderStyle: "solid" }}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase">{data.label}</p>
        {data.description && <InfoTooltip text={data.description} />}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {BMC_FIELDS.map(field => (
            <div key={field.key}>
              <label className="text-xs font-medium text-slate-600 block mb-1">{field.label}</label>
              <textarea
                value={fields[field.key as keyof typeof fields]}
                onChange={e => setFields(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder="Descreva..."
                className="w-full p-2 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]"
              />
            </div>
          ))}
          <div className="flex gap-2 sticky bottom-0 bg-white pt-2">
            <Button size="sm" onClick={handleSave} className="flex-1">Salvar ({filledCount}/9)</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
          </div>
        </div>
      ) : (
        <div>
          {filledCount > 0 ? (
            <div className="text-xs text-slate-700 mb-3 p-2 bg-slate-50 rounded grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {BMC_FIELDS.map(field => fields[field.key as keyof typeof fields] && (
                <div key={field.key} className="border-l-2 border-blue-400 pl-2">
                  <p className="font-medium text-slate-600">{field.label}</p>
                  <p className="text-slate-600 line-clamp-2">{fields[field.key as keyof typeof fields]}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 mb-3 p-2 bg-slate-50 rounded">Preencha pelo menos 5 campos do BMC</div>
          )}
          <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
            {filledCount > 0 ? `Editar (${filledCount}/9)` : "Preencher"}
          </Button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
