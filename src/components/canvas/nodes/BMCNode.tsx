"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore, DEFAULT_STYLE } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

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
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

type BMCFields = {
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valueProposition: string;
  customerSegments: string;
  customerRelationships: string;
  channels: string;
  costStructure: string;
  revenueStreams: string;
};

export function BMCNode({ data, id }: BMCNodeProps) {
  const [fields, setFields] = useState<BMCFields>({
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
  const { completeNode, updateNodeData } = useCanvasStore();
  const fontColor = data.nodeStyle?.fontColor ?? "#374151";
  const filledCount = Object.values(fields).filter(v => v.trim().length > 0).length;

  const upd = (key: keyof BMCFields) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFields(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = () => {
    if (filledCount > 0) {
      const nextData = { ...data, ...fields };
      if (filledCount >= 5) completeNode(id, nextData);
      else updateNodeData(id, nextData);
      setIsEditing(false);
    }
  };

  const lblCls = "text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mb-1";
  const taCls = "flex-1 w-full resize-none text-[11px] bg-transparent focus:outline-none placeholder:text-slate-200 leading-relaxed min-h-[80px]";
  const txtCls = "text-[11px] leading-relaxed break-words flex-1";
  const emptyCls = "text-[11px] text-slate-200 italic";

  const cell = (key: keyof BMCFields, label: string, placeholder: string, accent?: string) => (
    <div className="flex flex-col h-full p-2">
      <p className={lblCls} style={accent ? { color: accent } : undefined}>{label}</p>
      {isEditing ? (
        <textarea
          value={fields[key]}
          onChange={upd(key)}
          placeholder={placeholder}
          className={taCls}
          style={{ color: fontColor }}
        />
      ) : fields[key] ? (
        <p className={txtCls} style={{ color: fontColor }}>{fields[key]}</p>
      ) : (
        <p className={emptyCls}>{placeholder}</p>
      )}
    </div>
  );

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper
        nodeStyle={{
          ...DEFAULT_STYLE,
          ...data.nodeStyle,
          width: Math.max(data.nodeStyle?.width ?? 900, 900),
          height: Math.max(data.nodeStyle?.height ?? 920, 920),
        }}
        minWidth={900}
        minHeight={920}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: fontColor }}>
            {data.label}
          </p>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <span className="text-[11px] text-slate-400">{filledCount}/9</span>
                <Button size="sm" onClick={handleSave} disabled={filledCount === 0}>Salvar</Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                {filledCount > 0 ? `Editar (${filledCount}/9)` : "Preencher"}
              </Button>
            )}
            {data.description && <InfoTooltip text={data.description} />}
          </div>
        </div>

        {/* BMC Grid — Osterwalder layout */}
        <div
          className="flex-1 min-h-0 border border-slate-200 rounded overflow-hidden"
          style={{
            display: "grid",
            gridTemplateAreas:
              '"p a vp cr s" "p r vp ch s" "c c c  rv rv"',
            gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr",
            gridTemplateRows: "minmax(260px, 1fr) minmax(260px, 1fr) minmax(220px, 0.7fr)",
          }}
        >
          {/* Key Partners */}
          <div style={{ gridArea: "p", borderRight: "1px solid #e2e8f0" }}>
            {cell("keyPartners", "Parceiros-Chave", "Quem são seus parceiros estratégicos?")}
          </div>

          {/* Key Activities */}
          <div style={{ gridArea: "a", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
            {cell("keyActivities", "Atividades-Chave", "O que sua empresa faz de mais importante?")}
          </div>

          {/* Value Proposition */}
          <div style={{ gridArea: "vp", borderRight: "1px solid #e2e8f0", background: "#f8f9ff" }}>
            {cell("valueProposition", "Proposta de Valor", "Qual valor único você entrega ao cliente?", "#4f46e5")}
          </div>

          {/* Customer Relationships */}
          <div style={{ gridArea: "cr", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
            {cell("customerRelationships", "Relacionamento", "Como você se relaciona com seus clientes?")}
          </div>

          {/* Customer Segments */}
          <div style={{ gridArea: "s" }}>
            {cell("customerSegments", "Segmentos de Clientes", "Para quem você cria valor?")}
          </div>

          {/* Key Resources */}
          <div style={{ gridArea: "r", borderRight: "1px solid #e2e8f0" }}>
            {cell("keyResources", "Recursos-Chave", "Quais recursos são indispensáveis?")}
          </div>

          {/* Channels */}
          <div style={{ gridArea: "ch", borderRight: "1px solid #e2e8f0" }}>
            {cell("channels", "Canais", "Como você entrega valor e alcança clientes?")}
          </div>

          {/* Cost Structure */}
          <div style={{ gridArea: "c", borderRight: "1px solid #e2e8f0", borderTop: "1px solid #e2e8f0" }}>
            {cell("costStructure", "Estrutura de Custos", "Quais são os principais custos do negócio?")}
          </div>

          {/* Revenue Streams */}
          <div style={{ gridArea: "rv", borderTop: "1px solid #e2e8f0" }}>
            {cell("revenueStreams", "Fluxos de Receita", "Como o negócio gera receita?")}
          </div>
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
