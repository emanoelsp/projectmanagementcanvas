"use client";

import React, { useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  NodeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCanvasStore } from "@/stores/canvasStore";
import { InputNode } from "./nodes/InputNode";
import { BranchingNode } from "./nodes/BranchingNode";
import { MarketNode } from "./nodes/MarketNode";
import { PyramidNode } from "./nodes/PyramidNode";
import { FormatNode } from "./nodes/FormatNode";
import { BMCNode } from "./nodes/BMCNode";
import { LockedOverlay } from "./nodes/LockedOverlay";

const nodeTypes: NodeTypes = {
  input: InputNode,
  branching: BranchingNode,
  market: MarketNode,
  pyramid: PyramidNode,
  format: FormatNode,
  bmc: BMCNode,
  locked: LockedOverlay,
};

interface CanvasContainerProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export function CanvasContainer({ initialNodes, initialEdges }: CanvasContainerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { unlockedNodes } = useCanvasStore();

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      const updatedNodes = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          locked: !unlockedNodes.includes(node.id),
        },
      }));
      setNodes(updatedNodes);
    },
    [onNodesChange, unlockedNodes, nodes, setNodes]
  );

  return (
    <div className="w-full h-full bg-white">
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: { ...node.data, locked: !unlockedNodes.includes(node.id) },
        }))}
        edges={edges}
        onNodesChange={handleNodesChange}
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
