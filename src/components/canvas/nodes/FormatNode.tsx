"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { BUSINESS_FORMATS, REVENUE_FORMATS } from "@/lib/canvas-config";

interface FormatNodeProps {
  data: {
    label: string;
    businessFormat?: string[];
    revenueFormats?: string[];
    locked?: boolean;
  };
  id: string;
}

export function FormatNode({ data, id }: FormatNodeProps) {
  const [businessFormat, setBusinessFormat] = useState<string[]>(data.businessFormat || []);
  const [revenueFormats, setRevenueFormats] = useState<string[]>(data.revenueFormats || []);
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode } = useCanvasStore();

  const toggleFormat = (format: string, type: "business" | "revenue") => {
    if (type === "business") {
      setBusinessFormat(prev =>
        prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
      );
    } else {
      setRevenueFormats(prev =>
        prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
      );
    }
  };

  const handleSave = () => {
    if (businessFormat.length > 0 && revenueFormats.length > 0) {
      completeNode(id, { businessFormat, revenueFormats });
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
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">Formato de Negócio</label>
            <div className="space-y-2">
              {BUSINESS_FORMATS.map(format => (
                <label key={format} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={businessFormat.includes(format)}
                    onChange={() => toggleFormat(format, "business")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{format}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">Formas de Receita</label>
            <div className="space-y-2">
              {REVENUE_FORMATS.map(format => (
                <label key={format} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={revenueFormats.includes(format)}
                    onChange={() => toggleFormat(format, "revenue")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{format}</span>
                </label>
              ))}
            </div>
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
          {businessFormat.length > 0 && revenueFormats.length > 0 ? (
            <div className="text-sm text-slate-700 mb-3 p-2 bg-slate-50 rounded space-y-2">
              <div>
                <p className="font-medium text-xs text-slate-600 mb-1">Formato:</p>
                <div className="flex flex-wrap gap-1">
                  {businessFormat.map(f => (
                    <span key={f} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-xs text-slate-600 mb-1">Receita:</p>
                <div className="flex flex-wrap gap-1">
                  {revenueFormats.map(f => (
                    <span key={f} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 mb-3 p-2 bg-slate-50 rounded">
              Clique para selecionar formatos
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => setIsEditing(true)}
          >
            {businessFormat.length > 0 ? "Editar" : "Preencher"}
          </Button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
