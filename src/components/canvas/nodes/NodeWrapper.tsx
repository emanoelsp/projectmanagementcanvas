"use client";

import { NodeResizer } from "reactflow";
import type { NodeStyle } from "@/stores/canvasStore";

interface NodeWrapperProps {
  nodeStyle?: NodeStyle;
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  className?: string;
}

export function NodeWrapper({
  nodeStyle,
  children,
  minWidth = 200,
  minHeight = 120,
  className = "",
}: NodeWrapperProps) {
  const bg = nodeStyle?.bgColor ?? "#ffffff";
  const border = nodeStyle?.borderColor ?? "#cbd5e1";
  const radius = nodeStyle?.borderRadius ?? 8;
  const shape = nodeStyle?.shape ?? "rectangle";

  const outerStyle: React.CSSProperties = {
    backgroundColor: bg,
    borderColor: border,
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: radius,
    width: "100%",
    height: "100%",
    transform: shape === "diamond" ? "rotate(45deg)" : undefined,
  };

  const innerStyle: React.CSSProperties = {
    transform: shape === "diamond" ? "rotate(-45deg)" : undefined,
    padding: "1rem",
    height: "100%",
  };

  return (
    <>
      <NodeResizer
        minWidth={minWidth}
        minHeight={minHeight}
        handleStyle={{ width: 10, height: 10, borderRadius: 2 }}
        lineStyle={{ borderWidth: 1 }}
      />
      <div style={outerStyle} className={`overflow-hidden ${className}`}>
        <div style={innerStyle}>{children}</div>
      </div>
    </>
  );
}
