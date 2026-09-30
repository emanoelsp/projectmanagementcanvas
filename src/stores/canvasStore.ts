import { create } from "zustand";
import { CanvasNode, CanvasEdge } from "@/types";

export type NodeStyle = {
  bgColor: string;
  borderColor: string;
  borderRadius: number; // 0 = sharp, 12 = rounded
  shape: "rectangle" | "diamond";
};

const DEFAULT_STYLE: NodeStyle = {
  bgColor: "#ffffff",
  borderColor: "#cbd5e1",
  borderRadius: 8,
  shape: "rectangle",
};

const UNLOCK_MAP: Record<string, string | string[]> = {
  step1: "step2",
  // step2 handled conditionally based on paradigmChoice
  step2a: "",
  step2b: "",
  step3: "step4",
  step4: "step5",
  step5: "step6",
  step6: "step7",
  step7: "step8",
  step8: "",
};

interface CanvasState {
  nodes: Record<string, CanvasNode>;
  edges: CanvasEdge[];
  unlockedNodes: string[];
  completedNodes: string[];
  paradigmChoice: "A" | "B" | null;
  nodeStyles: Record<string, NodeStyle>;
  dirty: boolean;

  initCanvas: (nodes: Record<string, CanvasNode>, edges: CanvasEdge[], unlockedNodes: string[], completedNodes: string[], paradigmChoice?: "A" | "B", nodeStyles?: Record<string, NodeStyle>) => void;
  completeNode: (nodeId: string, data: Record<string, any>) => void;
  updateNodeData: (nodeId: string, data: Record<string, any>) => void;
  updateNodeStyle: (nodeId: string, style: Partial<NodeStyle>) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  unlockNode: (nodeId: string) => void;
  setParadigmChoice: (choice: "A" | "B") => void;
  reset: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  nodes: {},
  edges: [],
  unlockedNodes: ["step1"],
  completedNodes: [],
  paradigmChoice: null,
  nodeStyles: {},
  dirty: false,

  initCanvas: (nodes, edges, unlockedNodes, completedNodes, paradigmChoice, nodeStyles) =>
    set({ nodes, edges, unlockedNodes, completedNodes, paradigmChoice: paradigmChoice || null, nodeStyles: nodeStyles || {} }),

  completeNode: (nodeId, data) =>
    set((state) => {
      const updated = {
        ...state.nodes,
        [nodeId]: { ...state.nodes[nodeId], data, completed: true, locked: false },
      };

      let toUnlock: string[] = [];
      if (nodeId === "step2") {
        // Desbloqueia apenas o branch correspondente à escolha do paradigma
        const choice = data.choice || state.paradigmChoice;
        toUnlock = choice === "A" ? ["step2a", "step3"] : ["step2b", "step3"];
      } else {
        const nextIds = UNLOCK_MAP[nodeId];
        toUnlock = Array.isArray(nextIds)
          ? nextIds.filter(Boolean)
          : nextIds
          ? [nextIds]
          : [];
      }

      return {
        nodes: updated,
        unlockedNodes: [...new Set([...state.unlockedNodes, ...toUnlock])],
        completedNodes: [...new Set([...state.completedNodes, nodeId])],
        dirty: true,
      };
    }),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: { ...state.nodes[nodeId], data: { ...state.nodes[nodeId].data, ...data } },
      },
      dirty: true,
    })),

  updateNodePosition: (nodeId, position) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: { ...state.nodes[nodeId], position },
      },
      dirty: true,
    })),

  updateNodeStyle: (nodeId, style) =>
    set((state) => ({
      nodeStyles: {
        ...state.nodeStyles,
        [nodeId]: { ...(state.nodeStyles[nodeId] || DEFAULT_STYLE), ...style },
      },
      dirty: true,
    })),

  unlockNode: (nodeId) =>
    set((state) => ({
      unlockedNodes: [...new Set([...state.unlockedNodes, nodeId])],
    })),

  setParadigmChoice: (choice) => set({ paradigmChoice: choice, dirty: true }),

  reset: () =>
    set({
      nodes: {},
      edges: [],
      unlockedNodes: ["step1"],
      completedNodes: [],
      paradigmChoice: null,
      nodeStyles: {},
      dirty: false,
    }),
}));

export { DEFAULT_STYLE };
