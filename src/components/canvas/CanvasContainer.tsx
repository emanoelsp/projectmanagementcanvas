"use client";

import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  NodeTypes,
  NodeMouseHandler,
  NodeDragHandler,
  NodeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCanvasStore, DEFAULT_STYLE } from "@/stores/canvasStore";
import { InputNode } from "./nodes/InputNode";
import { BranchingNode } from "./nodes/BranchingNode";
import { MarketNode } from "./nodes/MarketNode";
import { PyramidNode } from "./nodes/PyramidNode";
import { FormatNode } from "./nodes/FormatNode";
import { BMCNode } from "./nodes/BMCNode";
import { VPCNode } from "./nodes/VPCNode";
import { MergerNode } from "./nodes/MergerNode";
import { StylePalette } from "./StylePalette";

const nodeTypes: NodeTypes = {
  input: InputNode,
  branching: BranchingNode,
  market: MarketNode,
  pyramid: PyramidNode,
  format: FormatNode,
  bmc: BMCNode,
  vpc: VPCNode,
  merger: MergerNode,
};

interface CanvasContainerProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  teamName: string;
}

export function CanvasContainer({ initialNodes, initialEdges, teamName }: CanvasContainerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { unlockedNodes, nodeStyles, nodes: storeNodes, updateNodePosition, updateNodeStyle } = useCanvasStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Reconstrói nós visíveis a partir do store, preservando posições e dimensões do ReactFlow
  useEffect(() => {
    setNodes(prev => {
      const prevMap: Record<string, { pos: { x: number; y: number }; w?: number; h?: number }> = {};
      prev.forEach(n => {
        prevMap[n.id] = {
          pos: n.position,
          w: n.style?.width as number | undefined,
          h: n.style?.height as number | undefined,
        };
      });

      return Object.values(storeNodes)
        .filter(node => unlockedNodes.includes(node.id))
        .map(node => {
          const style = nodeStyles[node.id] || DEFAULT_STYLE;
          const saved = prevMap[node.id];
          const width = saved?.w || style.width;
          const height = saved?.h || style.height;
          return {
            ...node,
            position: saved?.pos || node.position || { x: 0, y: 0 },
            style: width ? { width, height } : undefined,
            data: {
              ...node.data,
              locked: false,
              nodeStyle: style,
            },
          };
        });
    });
  }, [unlockedNodes, nodeStyles, storeNodes, setNodes]);

  // Captura resize e posição ao fim da interação
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      changes.forEach(change => {
        if (change.type === "dimensions" && !change.resizing && change.dimensions) {
          updateNodeStyle(change.id, {
            width: change.dimensions.width,
            height: change.dimensions.height,
          });
        }
      });
    },
    [onNodesChange, updateNodeStyle]
  );

  const onNodeDragStop: NodeDragHandler = useCallback(
    (_, node) => { updateNodePosition(node.id, node.position); },
    [updateNodePosition]
  );

  const visibleEdges = edges.filter(
    e => unlockedNodes.includes(e.source) && unlockedNodes.includes(e.target)
  );

  const onNodeClick: NodeMouseHandler = (_, node) => {
    setSelectedNodeId(prev => (prev === node.id ? null : node.id));
  };

  return (
    <div className="w-full h-full bg-white relative">
      <ReactFlow
        nodes={nodes}
        edges={visibleEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={() => setSelectedNodeId(null)}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls />

        <Panel position="top-right">
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 shadow-sm min-w-[140px]">
            <p className="text-xs text-yellow-700 font-medium uppercase tracking-wide mb-0.5">Projeto</p>
            <p className="text-sm font-bold text-yellow-900 truncate max-w-[180px]">{teamName}</p>
          </div>
        </Panel>

        {selectedNodeId && (
          <Panel position="top-left">
            <StylePalette nodeId={selectedNodeId} onClose={() => setSelectedNodeId(null)} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
