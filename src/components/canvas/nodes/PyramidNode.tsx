"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

const DESCRIPTION = `TAM (Total Addressable Market): todo o mercado disponível para o seu produto, considerando 100% dos potenciais clientes no mundo.

SAM (Serviceable Available Market): a fatia do TAM que você consegue atingir com seu modelo de negócio e distribuição atual.

SOM (Serviceable Obtainable Market): a parte realista do SAM que você pode conquistar nos próximos 1–3 anos, considerando concorrência e recursos disponíveis.`;

interface TamField {
  description: string;
  size: string;
  source: string;
}

const emptyField = (): TamField => ({ description: "", size: "", source: "" });

interface PyramidNodeProps {
  data: {
    label: string;
    tam?: string;
    sam?: string;
    som?: string;
    tamField?: TamField;
    samField?: TamField;
    somField?: TamField;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function PyramidNode({ data, id }: PyramidNodeProps) {
  const [tamField, setTamField] = useState<TamField>(
    data.tamField || (data.tam ? { description: data.tam, size: "", source: "" } : emptyField())
  );
  const [samField, setSamField] = useState<TamField>(
    data.samField || (data.sam ? { description: data.sam, size: "", source: "" } : emptyField())
  );
  const [somField, setSomField] = useState<TamField>(
    data.somField || (data.som ? { description: data.som, size: "", source: "" } : emptyField())
  );
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode, updateNodeData } = useCanvasStore();
  const fontColor = data.nodeStyle?.fontColor ?? "#64748b";

  const handleSave = () => {
    if (tamField.description.trim() || samField.description.trim() || somField.description.trim()) {
      const nextData = { ...data, tamField, samField, somField };
      if (tamField.description.trim() && samField.description.trim() && somField.description.trim()) {
        completeNode(id, nextData);
      } else {
        updateNodeData(id, nextData);
      }
      setIsEditing(false);
    }
  };

  const isFilled = tamField.description && samField.description && somField.description;

  const columns = [
    { key: "TAM", label: "TAM", sublabel: "Total Addressable Market", field: tamField, set: setTamField, color: "blue" },
    { key: "SAM", label: "SAM", sublabel: "Serviceable Available Market", field: samField, set: setSamField, color: "violet" },
    { key: "SOM", label: "SOM", sublabel: "Serviceable Obtainable Market", field: somField, set: setSomField, color: "emerald" },
  ] as const;

  const colorMap = {
    blue: "border-blue-400 bg-blue-50",
    violet: "border-violet-400 bg-violet-50",
    emerald: "border-emerald-400 bg-emerald-50",
  };

  const badgeMap = {
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={480} minHeight={180}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase" style={{ color: fontColor }}>{data.label}</p>
          <InfoTooltip text={DESCRIPTION} />
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {columns.map(col => (
                <div key={col.key} className={`rounded-lg border-2 p-2 ${colorMap[col.color]}`}>
                  <p className={`text-xs font-bold mb-1 px-1.5 py-0.5 rounded inline-block ${badgeMap[col.color]}`}>
                    {col.label}
                  </p>
                  <p className="text-[10px] text-slate-500 mb-2">{col.sublabel}</p>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={col.field.description}
                      onChange={e => col.set(f => ({ ...f, description: e.target.value }))}
                      placeholder="Descreva em uma frase"
                      className="w-full p-1.5 text-xs border border-white rounded focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                    />
                    <input
                      type="text"
                      value={col.field.size}
                      onChange={e => col.set(f => ({ ...f, size: e.target.value }))}
                      placeholder="Tamanho (ex: $50M, 2M pessoas)"
                      className="w-full p-1.5 text-xs border border-white rounded focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                    />
                    <input
                      type="text"
                      value={col.field.source}
                      onChange={e => col.set(f => ({ ...f, source: e.target.value }))}
                      placeholder="Fonte (ex: IBGE, Statista)"
                      className="w-full p-1.5 text-xs border border-white rounded focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1">Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
            </div>
          </div>
        ) : (
          <div>
            {isFilled ? (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {columns.map(col => (
                  <div key={col.key} className={`rounded-lg border-2 p-2 ${colorMap[col.color]}`}>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${badgeMap[col.color]}`}>{col.label}</span>
                    <p className="text-xs mt-1.5 break-words" style={{ color: fontColor }}>{col.field.description}</p>
                    {col.field.size && (
                      <p className="text-xs font-semibold mt-1" style={{ color: fontColor }}>📊 {col.field.size}</p>
                    )}
                    {col.field.source && (
                      <p className="text-[10px] text-slate-400 mt-0.5">Fonte: {col.field.source}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 mb-2 opacity-40">
                {columns.map(col => (
                  <div key={col.key} className={`rounded-lg border-2 p-2 ${colorMap[col.color]}`}>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${badgeMap[col.color]}`}>{col.label}</span>
                    <p className="text-xs mt-2 text-slate-400">Clique para preencher</p>
                  </div>
                ))}
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
