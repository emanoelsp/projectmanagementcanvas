"use client";

import { NodeResizer } from "reactflow";
import type { NodeStyle } from "@/stores/canvasStore";

interface NodeWrapperProps {
  nodeStyle?: NodeStyle;
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  className?: string;
}

export function NodeWrapper({
  nodeStyle,
  children,
  minWidth = 200,
  minHeight = 120,
  maxWidth,
  className = "",
}: NodeWrapperProps) {
  const bg = nodeStyle?.bgColor ?? "#ffffff";
  const border = nodeStyle?.borderColor ?? "#cbd5e1";
  const radius = nodeStyle?.borderRadius ?? 8;
  const shape = nodeStyle?.shape ?? "rectangle";

  const resolvedWidth = nodeStyle?.width != null ? Math.max(nodeStyle.width, minWidth) : undefined;
  const resolvedHeight = nodeStyle?.height != null ? Math.max(nodeStyle.height, minHeight) : undefined;

  const fillHeight = resolvedHeight != null;

  const outerStyle: React.CSSProperties = {
    backgroundColor: bg,
    borderColor: border,
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: radius,
    minWidth,
    minHeight,
    width: resolvedWidth,
    height: resolvedHeight,
    ...(fillHeight ? { display: "flex", flexDirection: "column" } : {}),
    transform: shape === "diamond" ? "rotate(45deg)" : undefined,
  };

  const innerStyle: React.CSSProperties = {
    transform: shape === "diamond" ? "rotate(-45deg)" : undefined,
    padding: "1rem",
    ...(fillHeight
      ? { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }
      : {}),
  };

  return (
    <>
      <NodeResizer
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth={maxWidth}
        lineStyle={{ borderColor: "transparent" }}
        handleStyle={{ backgroundColor: "transparent", borderColor: "transparent", width: 14, height: 14 }}
      />
      <div style={outerStyle} className={`overflow-hidden ${className}`}>
        <div style={innerStyle}>{children}</div>
      </div>
    </>
  );
}
