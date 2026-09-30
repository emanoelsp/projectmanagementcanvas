"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import type { NodeStyle } from "@/stores/canvasStore";

interface PyramidNodeProps {
  data: {
    label: string;
    tam?: string;
    sam?: string;
    som?: string;
    locked?: boolean;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function PyramidNode({ data, id }: PyramidNodeProps) {
  const [tam, setTam] = useState(data.tam || "");
  const [sam, setSam] = useState(data.sam || "");
  const [som, setSom] = useState(data.som || "");
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode } = useCanvasStore();

  const handleSave = () => {
    if (tam.trim() && sam.trim() && som.trim()) {
      completeNode(id, { ...data, tam, sam, som });
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
        <div className="space-y-3">
          {[
            { label: "TAM (Total Addressable Market)", value: tam, set: setTam, placeholder: "Ex: $50M" },
            { label: "SAM (Serviceable Available Market)", value: sam, set: setSam, placeholder: "Ex: $15M" },
            { label: "SOM (Serviceable Obtainable Market)", value: som, set: setSom, placeholder: "Ex: $2M" },
          ].map(field => (
            <div key={field.label}>
              <label className="text-xs font-medium text-slate-600">{field.label}</label>
              <input
                type="text"
                value={field.value}
                onChange={e => field.set(e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="flex-1">Salvar</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
          </div>
        </div>
      ) : (
        <div>
          {tam && sam && som ? (
            <div className="text-sm text-slate-700 mb-3 p-3 bg-slate-50 rounded space-y-1">
              {[{ k: "TAM", v: tam }, { k: "SAM", v: sam }, { k: "SOM", v: som }].map(r => (
                <div key={r.k} className="flex justify-between items-center">
                  <span className="font-medium text-xs">{r.k}:</span>
                  <span className="text-slate-600 text-xs">{r.v}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-400 mb-3 p-3 bg-slate-50 rounded">Clique para preencher TAM/SAM/SOM</div>
          )}
          <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
            {tam ? "Editar" : "Preencher"}
          </Button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
