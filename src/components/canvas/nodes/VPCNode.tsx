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

  const taCls = "flex-1 w-full resize-none text-[11px] bg-transparent focus:outline-none placeholder:text-slate-300 leading-relaxed min-h-[60px]";
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
      <p className={fields[key] ? txtCls : "text-[11px] italic text-slate-300 flex-1"} style={fields[key] ? { color: fontColor } : undefined}>
        {fields[key] || placeholder}
      </p>
    );

  const squareSize = 400;
  const circleSize = 400;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={900} minHeight={520}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
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

        {/* VPC Classic Layout */}
        <div className="flex items-center justify-center gap-0 flex-1 min-h-0">
          {/* === LEFT: Value Proposition Square with diagonal sections === */}
          <div className="relative shrink-0" style={{ width: squareSize, height: squareSize }}>
            {/* Square border */}
            <div
              className="absolute inset-0 border-2 border-slate-700"
              style={{ borderRadius: 4 }}
            />

            {/* Diagonal lines via SVG */}
            <svg
              className="absolute inset-0 pointer-events-none"
              viewBox={`0 0 ${squareSize} ${squareSize}`}
              width={squareSize}
              height={squareSize}
            >
              {/* Top-right diagonal: from center to top-right */}
              <line x1={squareSize * 0.38} y1={squareSize * 0.5} x2={squareSize} y2={0} stroke="#334155" strokeWidth="1.5" />
              {/* Bottom-right diagonal: from center to bottom-right */}
              <line x1={squareSize * 0.38} y1={squareSize * 0.5} x2={squareSize} y2={squareSize} stroke="#334155" strokeWidth="1.5" />
            </svg>

            {/* Products & Services - Left triangle */}
            <div
              className="absolute flex flex-col items-start justify-center p-3"
              style={{
                left: 8,
                top: squareSize * 0.15,
                width: squareSize * 0.35,
                height: squareSize * 0.7,
              }}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
                📦 Produtos & Serviços
              </p>
              {renderField("products", "O que você oferece?")}
            </div>

            {/* Gain Creators - Top-right triangle */}
            <div
              className="absolute flex flex-col items-center p-2"
              style={{
                right: 8,
                top: 10,
                width: squareSize * 0.52,
                height: squareSize * 0.38,
              }}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
                📈 Criadores de Ganho
              </p>
              {renderField("gainCreators", "Como você cria benefícios?")}
            </div>

            {/* Pain Relievers - Bottom-right triangle */}
            <div
              className="absolute flex flex-col items-center justify-end p-2"
              style={{
                right: 8,
                bottom: 10,
                width: squareSize * 0.52,
                height: squareSize * 0.38,
              }}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                💊 Aliviadores de Dor
              </p>
              {renderField("painRelievers", "Como resolve os problemas?")}
            </div>

            {/* Labels */}
            <div
              className="absolute text-[9px] font-bold uppercase text-slate-400 tracking-wider"
              style={{ top: -18, left: 0 }}
            >
              Proposta de Valor
            </div>
          </div>

          {/* Arrow connector */}
          <div className="flex items-center px-2 shrink-0">
            <svg width="40" height="20" viewBox="0 0 40 20">
              <line x1="0" y1="10" x2="32" y2="10" stroke="#64748b" strokeWidth="2" />
              <polygon points="30,5 40,10 30,15" fill="#64748b" />
            </svg>
          </div>

          {/* === RIGHT: Customer Segment Circle with pie sections === */}
          <div className="relative shrink-0" style={{ width: circleSize, height: circleSize }}>
            {/* Circle border */}
            <div
              className="absolute inset-0 border-2 border-slate-700"
              style={{ borderRadius: "50%" }}
            />

            {/* Pie dividers via SVG */}
            <svg
              className="absolute inset-0 pointer-events-none"
              viewBox={`0 0 ${circleSize} ${circleSize}`}
              width={circleSize}
              height={circleSize}
            >
              {/* Horizontal line through center */}
              <line x1={circleSize * 0.15} y1={circleSize * 0.5} x2={circleSize * 0.85} y2={circleSize * 0.5} stroke="#334155" strokeWidth="1.5" />
              {/* Small inner circle */}
              <circle cx={circleSize * 0.5} cy={circleSize * 0.5} r={circleSize * 0.12} fill="none" stroke="#334155" strokeWidth="1.5" />
            </svg>

            {/* Gains - Top half */}
            <div
              className="absolute flex flex-col items-center p-3"
              style={{
                top: 20,
                left: circleSize * 0.15,
                width: circleSize * 0.7,
                height: circleSize * 0.35,
              }}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
                😊 Ganhos
              </p>
              {renderField("gains", "O que o cliente quer alcançar?")}
            </div>

            {/* Customer Jobs - Center (inside inner circle area) */}
            <div
              className="absolute flex flex-col items-end justify-center pr-3"
              style={{
                top: circleSize * 0.3,
                right: 10,
                width: circleSize * 0.38,
                height: circleSize * 0.4,
              }}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                📋 Tarefas do Cliente
              </p>
              {renderField("customerJobs", "O que precisa fazer?")}
            </div>

            {/* Pains - Bottom half */}
            <div
              className="absolute flex flex-col items-center justify-end p-3"
              style={{
                bottom: 20,
                left: circleSize * 0.15,
                width: circleSize * 0.7,
                height: circleSize * 0.35,
              }}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                😟 Dores
              </p>
              {renderField("pains", "Quais frustrações e obstáculos?")}
            </div>

            {/* Labels */}
            <div
              className="absolute text-[9px] font-bold uppercase text-slate-400 tracking-wider"
              style={{ top: -18, left: 0 }}
            >
              Perfil do Cliente
            </div>
          </div>
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
