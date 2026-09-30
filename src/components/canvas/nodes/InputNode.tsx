"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { NodeWrapper } from "./NodeWrapper";
import type { NodeStyle } from "@/stores/canvasStore";

interface InputNodeProps {
  data: {
    label: string;
    content?: string;
    locked?: boolean;
    description?: string;
    nodeStyle?: NodeStyle;
  };
  id: string;
}

export function InputNode({ data, id }: InputNodeProps) {
  const [content, setContent] = useState(data.content || "");
  const [isEditing, setIsEditing] = useState(false);
  const { completeNode } = useCanvasStore();

  const fontColor = data.nodeStyle?.fontColor ?? "#64748b";

  const handleSave = () => {
    if (content.trim()) {
      completeNode(id, { ...data, content });
      setIsEditing(false);
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeWrapper nodeStyle={data.nodeStyle} minWidth={200} minHeight={130}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase" style={{ color: fontColor }}>{data.label}</p>
          {data.description && <InfoTooltip text={data.description} />}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Descreva aqui..."
              className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px]"
              style={{ color: fontColor }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1">Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
            </div>
          </div>
        ) : (
          <div>
            {content ? (
              <div className="text-sm mb-3 p-2 bg-white/50 rounded min-h-[60px] break-words" style={{ color: fontColor }}>{content}</div>
            ) : (
              <div className="text-sm mb-3 p-2 bg-white/30 rounded min-h-[60px] opacity-60" style={{ color: fontColor }}>Clique para preencher</div>
            )}
            <Button size="sm" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              {content ? "Editar" : "Preencher"}
            </Button>
          </div>
        )}
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
