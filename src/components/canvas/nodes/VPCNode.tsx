"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

const VPC_DESCRIPTION =
  "O Value Proposition Canvas detalha o encaixe entre sua oferta e as necessidades do cliente. " +
  "À esquerda (Proposta de Valor): Produtos & Serviços — o que você entrega; Criadores de Ganho — como gera benefícios; Aliviadores de Dor — como resolve problemas. " +
  "À direita (Perfil do Cliente): Ganhos — o que o cliente deseja alcançar; Tarefas — o que precisa fazer; Dores — frustrações e obstáculos.";

interface VPCNodeProps {
  data: {
    label: string;
    products?: string;
    gainCreators?: string;
    painRelievers?: string;
    gains?: string;
    customerJobs?: string;
    pains?: string;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

type VPCFields = {
  products: string;
  gainCreators: string;
  painRelievers: string;
  gains: string;
  customerJobs: string;
  pains: string;
};

export function VPCNode({ data, id }: VPCNodeProps) {
  const [fields, setFields] = useState<VPCFields>({
    products: data.products || "",
    gainCreators: data.gainCreators || "",
    painRelievers: data.painRelievers || "",
    gains: data.gains || "",
    customerJobs: data.customerJobs || "",
    pains: data.pains || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode } = useCanvasStore();
  const fontColor = data.nodeStyle?.fontColor ?? "#374151";
  const filledCount = Object.values(fields).filter(v => v.trim().length > 0).length;

  const upd = (key: keyof VPCFields) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFields(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = () => {
    if (filledCount >= 4) {
      completeNode(id, { ...data, ...fields });
      setIsEditing(false);
    }
  };

  const taCls = "flex-1 w-full resize-none text-[11px] bg-transparent focus:outline-none placeholder:text-slate-200 leading-relaxed";
  const txtCls = "text-[11px] leading-relaxed break-words flex-1";

  const renderField = (key: keyof VPCFields, placeholder: string) =>
    isEditing ? (
      <textarea
        value={fields[key]}
        onChange={upd(key)}
        placeholder={placeholder}
        className={taCls}
        style={{ color: fontColor }}
      />
    ) : (
      <p className={fields[key] ? txtCls : "text-[11px] italic text-slate-200 flex-1"} style={fields[key] ? { color: fontColor } : undefined}>
        {fields[key] || placeholder}
      </p>
    );

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={520} minHeight={480}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: fontColor }}>
            {data.label}
          </p>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <span className="text-[11px] text-slate-400">{filledCount}/6</span>
                <Button size="sm" onClick={handleSave} disabled={filledCount < 4}>Salvar</Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                {filledCount > 0 ? `Editar (${filledCount}/6)` : "Preencher"}
              </Button>
            )}
            <InfoTooltip text={VPC_DESCRIPTION} />
          </div>
        </div>

        {/* VPC Layout */}
        <div className="flex gap-3 flex-1 min-h-0">
          {/* Left: Value Proposition Square */}
          <div className="flex-1 flex flex-col border-2 border-slate-300 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-2 py-1 text-center border-b border-slate-200">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Proposta de Valor</p>
            </div>

            {/* Gain Creators */}
            <div className="flex flex-col p-2 border-b border-slate-200 bg-emerald-50 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
                ↑ Criadores de Ganho
              </p>
              {renderField("gainCreators", "Como você cria benefícios para o cliente?")}
            </div>

            {/* Products & Services */}
            <div className="flex flex-col p-2 border-b border-slate-200 bg-indigo-50 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
                Produtos &amp; Serviços
              </p>
              {renderField("products", "O que você oferece ao cliente?")}
            </div>

            {/* Pain Relievers */}
            <div className="flex flex-col p-2 bg-rose-50 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                ↓ Aliviadores de Dor
              </p>
              {renderField("painRelievers", "Como você resolve os problemas do cliente?")}
            </div>
          </div>

          {/* Arrow connector */}
          <div className="flex flex-col items-center justify-center gap-1 shrink-0">
            <div className="w-px flex-1 bg-slate-200" />
            <span className="text-slate-300 text-lg">↔</span>
            <div className="w-px flex-1 bg-slate-200" />
          </div>

          {/* Right: Customer Circle */}
          <div
            className="flex-1 flex flex-col border-2 border-slate-300 overflow-hidden"
            style={{ borderRadius: "50% / 10%" }}
          >
            <div className="bg-slate-100 px-2 py-1 text-center border-b border-slate-200">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Perfil do Cliente</p>
            </div>

            {/* Gains */}
            <div className="flex flex-col p-2 border-b border-slate-200 bg-emerald-50 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 mb-1 text-center">
                ↑ Ganhos
              </p>
              {renderField("gains", "O que o cliente quer alcançar ou ganhar?")}
            </div>

            {/* Customer Jobs */}
            <div className="flex flex-col p-2 border-b border-slate-200 bg-white flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1 text-center">
                Tarefas do Cliente
              </p>
              {renderField("customerJobs", "O que o cliente está tentando fazer?")}
            </div>

            {/* Pains */}
            <div className="flex flex-col p-2 bg-rose-50 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-rose-600 mb-1 text-center">
                ↓ Dores
              </p>
              {renderField("pains", "Quais frustrações e obstáculos o cliente enfrenta?")}
            </div>
          </div>
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
