"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";

interface PyramidNodeProps {
  data: {
    label: string;
    tam?: string;
    sam?: string;
    som?: string;
    locked?: boolean;
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
      completeNode(id, { tam, sam, som });
      setIsEditing(false);
    }
  };

  if (data.locked) {
    return (
      <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 w-56 opacity-50">
        <Handle type="target" position={Position.Top} />
        <p className="text-xs font-medium text-slate-500 mb-2">🔒 Bloqueado</p>
        <p className="text-sm font-medium truncate">{data.label}</p>
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-4 w-80 shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} />

      <div className="mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase">{data.label}</p>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">TAM (Total Addressable Market)</label>
            <input
              type="text"
              value={tam}
              onChange={(e) => setTam(e.target.value)}
              placeholder="Ex: $50M"
              className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">SAM (Serviceable Available Market)</label>
            <input
              type="text"
              value={sam}
              onChange={(e) => setSam(e.target.value)}
              placeholder="Ex: $15M"
              className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">SOM (Serviceable Obtainable Market)</label>
            <input
              type="text"
              value={som}
              onChange={(e) => setSom(e.target.value)}
              placeholder="Ex: $2M"
              className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="flex-1">
              Salvar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {tam && sam && som ? (
            <div className="text-sm text-slate-700 mb-3 p-3 bg-slate-50 rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">TAM:</span>
                <span className="text-slate-600">{tam}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">SAM:</span>
                <span className="text-slate-600">{sam}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">SOM:</span>
                <span className="text-slate-600">{som}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 mb-3 p-3 bg-slate-50 rounded">
              Clique para preencher TAM/SAM/SOM
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => setIsEditing(true)}
          >
            {tam ? "Editar" : "Preencher"}
          </Button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
