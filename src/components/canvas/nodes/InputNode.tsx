"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";

interface InputNodeProps {
  data: {
    label: string;
    content?: string;
    locked?: boolean;
  };
  id: string;
}

export function InputNode({ data, id }: InputNodeProps) {
  const [content, setContent] = useState(data.content || "");
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode } = useCanvasStore();

  const handleSave = () => {
    if (content.trim()) {
      completeNode(id, { content });
      setIsEditing(false);
    }
  };

  if (data.locked) {
    return (
      <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 w-48 opacity-50">
        <Handle type="target" position={Position.Top} />
        <p className="text-xs font-medium text-slate-500 mb-2">🔒 Bloqueado</p>
        <p className="text-sm font-medium truncate">{data.label}</p>
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-4 w-64 shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} />

      <div className="mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase">{data.label}</p>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Descreva aqui..."
            className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          />
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
          {content ? (
            <div className="text-sm text-slate-700 mb-3 p-2 bg-slate-50 rounded min-h-[60px] break-words">
              {content}
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
            {content ? "Editar" : "Preencher"}
          </Button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
