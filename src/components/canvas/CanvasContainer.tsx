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
} from "reactflow";
import "reactflow/dist/style.css";
import { useCanvasStore, DEFAULT_STYLE } from "@/stores/canvasStore";
import { InputNode } from "./nodes/InputNode";
import { BranchingNode } from "./nodes/BranchingNode";
import { MarketNode } from "./nodes/MarketNode";
import { PyramidNode } from "./nodes/PyramidNode";
import { FormatNode } from "./nodes/FormatNode";
import { BMCNode } from "./nodes/BMCNode";
import { StylePalette } from "./StylePalette";

const nodeTypes: NodeTypes = {
  input: InputNode,
  branching: BranchingNode,
  market: MarketNode,
  pyramid: PyramidNode,
  format: FormatNode,
  bmc: BMCNode,
};

interface CanvasContainerProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  teamName: string;
}

export function CanvasContainer({ initialNodes, initialEdges, teamName }: CanvasContainerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { unlockedNodes, nodeStyles, nodes: storeNodes, updateNodePosition } = useCanvasStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Reconstrói a lista de nós visíveis a partir do store sempre que unlockedNodes ou estilos mudam
  // Preserva as posições atuais do ReactFlow para não perder drags
  useEffect(() => {
    setNodes(prev => {
      const positionMap: Record<string, { x: number; y: number }> = {};
      prev.forEach(n => { positionMap[n.id] = n.position; });

      return Object.values(storeNodes)
        .filter(node => unlockedNodes.includes(node.id))
        .map(node => ({
          ...node,
          position: positionMap[node.id] || node.position || { x: 0, y: 0 },
          data: {
            ...node.data,
            locked: false,
            nodeStyle: nodeStyles[node.id] || DEFAULT_STYLE,
          },
        }));
    });
  }, [unlockedNodes, nodeStyles, storeNodes, setNodes]);

  // Persiste posição no store após arrastar um nó
  const onNodeDragStop: NodeDragHandler = useCallback(
    (_, node) => {
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition]
  );

  // Filtra arestas onde source ou target ainda não foi desbloqueado
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={() => setSelectedNodeId(null)}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls />

        {/* Post-it com nome do projeto */}
        <Panel position="top-right">
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 shadow-sm min-w-[140px]">
            <p className="text-xs text-yellow-700 font-medium uppercase tracking-wide mb-0.5">Projeto</p>
            <p className="text-sm font-bold text-yellow-900 truncate max-w-[180px]">{teamName}</p>
          </div>
        </Panel>

        {/* Paleta de estilos flutuante */}
        {selectedNodeId && (
          <Panel position="top-left">
            <StylePalette nodeId={selectedNodeId} onClose={() => setSelectedNodeId(null)} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
