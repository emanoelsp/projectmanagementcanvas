"use client";

import React, { useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCanvasStore } from "@/stores/canvasStore";
import { InputNode } from "./nodes/InputNode";
import { BranchingNode } from "./nodes/BranchingNode";
import { MarketNode } from "./nodes/MarketNode";
import { PyramidNode } from "./nodes/PyramidNode";
import { FormatNode } from "./nodes/FormatNode";
import { BMCNode } from "./nodes/BMCNode";

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
}

export function CanvasContainer({ initialNodes, initialEdges }: CanvasContainerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { unlockedNodes } = useCanvasStore();

  // Sincroniza locked state dos nós quando unlockedNodes muda no Zustand
  useEffect(() => {
    setNodes(prev =>
      prev.map(node => ({
        ...node,
        data: {
          ...node.data,
          locked: !unlockedNodes.includes(node.id),
        },
      }))
    );
  }, [unlockedNodes, setNodes]);

  return (
    <div className="w-full h-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#aaa" gap={16} size={0.5} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
