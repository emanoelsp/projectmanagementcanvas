import { Handle, Position } from "reactflow";

interface LockedOverlayProps {
  data: {
    label: string;
  };
}

export function LockedOverlay({ data }: LockedOverlayProps) {
  return (
    <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 w-48 opacity-50">
      <Handle type="target" position={Position.Top} />
      <p className="text-xs font-medium text-slate-500 mb-2">🔒 Bloqueado</p>
      <p className="text-sm font-medium truncate">{data.label}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
