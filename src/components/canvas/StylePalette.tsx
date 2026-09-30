"use client";

import { useCanvasStore, NodeStyle, DEFAULT_STYLE } from "@/stores/canvasStore";
import { X } from "lucide-react";

interface StylePaletteProps {
  nodeId: string;
  onClose: () => void;
}

export function StylePalette({ nodeId, onClose }: StylePaletteProps) {
  const { nodeStyles, updateNodeStyle } = useCanvasStore();
  const style: NodeStyle = nodeStyles[nodeId] || DEFAULT_STYLE;

  const set = (patch: Partial<NodeStyle>) => updateNodeStyle(nodeId, patch);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-56 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Estilo do Quadro</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-500">Fundo</label>
        <input
          type="color"
          value={style.bgColor}
          onChange={e => set({ bgColor: e.target.value })}
          className="w-full h-8 rounded cursor-pointer border border-slate-200"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-500">Borda</label>
        <input
          type="color"
          value={style.borderColor}
          onChange={e => set({ borderColor: e.target.value })}
          className="w-full h-8 rounded cursor-pointer border border-slate-200"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-500">Cantos</label>
        <div className="flex gap-2">
          <button
            onClick={() => set({ borderRadius: 0 })}
            className={`flex-1 py-1 text-xs border rounded transition-colors ${style.borderRadius === 0 ? "bg-slate-800 text-white border-slate-800" : "border-slate-300 text-slate-600 hover:border-slate-500"}`}
          >
            Reto
          </button>
          <button
            onClick={() => set({ borderRadius: 8 })}
            className={`flex-1 py-1 text-xs border rounded-lg transition-colors ${style.borderRadius === 8 ? "bg-slate-800 text-white border-slate-800" : "border-slate-300 text-slate-600 hover:border-slate-500"}`}
          >
            Arredondado
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-500">Formato</label>
        <div className="flex gap-2">
          <button
            onClick={() => set({ shape: "rectangle" })}
            className={`flex-1 py-1 text-xs border rounded transition-colors ${style.shape === "rectangle" ? "bg-slate-800 text-white border-slate-800" : "border-slate-300 text-slate-600 hover:border-slate-500"}`}
          >
            ▭ Retângulo
          </button>
          <button
            onClick={() => set({ shape: "diamond" })}
            className={`flex-1 py-1 text-xs border rounded transition-colors ${style.shape === "diamond" ? "bg-slate-800 text-white border-slate-800" : "border-slate-300 text-slate-600 hover:border-slate-500"}`}
          >
            ◇ Losango
          </button>
        </div>
      </div>

      <button
        onClick={() => updateNodeStyle(nodeId, DEFAULT_STYLE)}
        className="w-full text-xs text-slate-400 hover:text-slate-600 pt-1 border-t border-slate-100"
      >
        Redefinir padrão
      </button>
    </div>
  );
}
