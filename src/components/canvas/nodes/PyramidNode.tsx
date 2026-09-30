"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

interface PyramidNodeProps {
  data: {
    label: string;
    tam?: string;
    sam?: string;
    som?: string;
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
  const fontColor = data.nodeStyle?.fontColor ?? "#64748b";

  const handleSave = () => {
    if (tam.trim() && sam.trim() && som.trim()) {
      completeNode(id, { ...data, tam, sam, som });
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
          <div className="space-y-2">
            {[
              { label: "TAM (Total Addressable Market)", value: tam, set: setTam, ph: "Ex: $50M" },
              { label: "SAM (Serviceable Available Market)", value: sam, set: setSam, ph: "Ex: $15M" },
              { label: "SOM (Serviceable Obtainable Market)", value: som, set: setSom, ph: "Ex: $2M" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium" style={{ color: fontColor }}>{f.label}</label>
                <input type="text" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                  className="w-full p-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-0.5" />
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
              <div className="text-sm mb-2 p-2 bg-white/50 rounded space-y-1">
                {[{ k: "TAM", v: tam }, { k: "SAM", v: sam }, { k: "SOM", v: som }].map(r => (
                  <div key={r.k} className="flex justify-between">
                    <span className="font-medium text-xs" style={{ color: fontColor }}>{r.k}:</span>
                    <span className="text-xs" style={{ color: fontColor }}>{r.v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm mb-2 p-2 bg-white/30 rounded min-h-[50px] opacity-60" style={{ color: fontColor }}>Clique para preencher TAM/SAM/SOM</div>
            )}
            <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              {tam ? "Editar" : "Preencher"}
            </Button>
          </div>
        )}
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
