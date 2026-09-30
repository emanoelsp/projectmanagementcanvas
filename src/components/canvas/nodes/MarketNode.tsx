"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";

interface MarketNodeProps {
  data: {
    label: string;
    audience?: string;
    inspiration?: string;
    competitor?: string;
    paradigmChoice?: "A" | "B" | null;
    locked?: boolean;
  };
  id: string;
}

export function MarketNode({ data, id }: MarketNodeProps) {
  const [audience, setAudience] = useState(data.audience || "");
  const [inspiration, setInspiration] = useState(data.inspiration || "");
  const [competitor, setCompetitor] = useState(data.competitor || "");
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode, paradigmChoice } = useCanvasStore();

  const handleSave = () => {
    if (audience.trim()) {
      completeNode(id, { audience, inspiration, competitor });
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
    <div className="bg-white border-2 border-slate-300 rounded-lg p-4 w-72 shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} />

      <div className="mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase">{data.label}</p>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Público-alvo</label>
            <textarea
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Descreva em uma frase..."
              className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] mt-1"
            />
          </div>

          {paradigmChoice === "A" && (
            <div>
              <label className="text-xs font-medium text-slate-600">Inspiração (Schumpeteriana)</label>
              <textarea
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
                placeholder="Qual é a inspiração disso?"
                className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] mt-1"
              />
            </div>
          )}

          {paradigmChoice === "B" && (
            <div>
              <label className="text-xs font-medium text-slate-600">Concorrente Principal</label>
              <textarea
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                placeholder="Qual é o principal concorrente?"
                className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] mt-1"
              />
            </div>
          )}

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
          {audience ? (
            <div className="text-sm text-slate-700 mb-3 p-2 bg-slate-50 rounded min-h-[60px] break-words">
              <p className="font-medium text-xs text-slate-600 mb-1">Público-alvo:</p>
              <p>{audience}</p>
              {paradigmChoice === "A" && inspiration && (
                <>
                  <p className="font-medium text-xs text-slate-600 mt-2 mb-1">Inspiração:</p>
                  <p className="text-sm">{inspiration}</p>
                </>
              )}
              {paradigmChoice === "B" && competitor && (
                <>
                  <p className="font-medium text-xs text-slate-600 mt-2 mb-1">Concorrente:</p>
                  <p className="text-sm">{competitor}</p>
                </>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400 mb-3 p-2 bg-slate-50 rounded min-h-[60px]">
              Clique para preencher
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => setIsEditing(true)}
          >
            {audience ? "Editar" : "Preencher"}
          </Button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
