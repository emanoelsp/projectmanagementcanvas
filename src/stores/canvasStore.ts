import { create } from "zustand";
import { CanvasNode, CanvasEdge } from "@/types";

const UNLOCK_MAP: Record<string, string | string[]> = {
  step1: "step2",
  step2: ["step2a", "step2b", "step3"],
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
  dirty: boolean;

  initCanvas: (nodes: Record<string, CanvasNode>, edges: CanvasEdge[], unlockedNodes: string[], completedNodes: string[], paradigmChoice?: "A" | "B") => void;
  completeNode: (nodeId: string, data: Record<string, any>) => void;
  updateNodeData: (nodeId: string, data: Record<string, any>) => void;
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
  dirty: false,

  initCanvas: (nodes, edges, unlockedNodes, completedNodes, paradigmChoice) =>
    set({
      nodes,
      edges,
      unlockedNodes,
      completedNodes,
      paradigmChoice: paradigmChoice || null,
    }),

  completeNode: (nodeId: string, data: Record<string, any>) =>
    set((state) => {
      const updated = {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          data,
          completed: true,
          locked: false,
        },
      };

      const nextIds = UNLOCK_MAP[nodeId];
      const toUnlock = Array.isArray(nextIds) ? nextIds.filter(Boolean) : (nextIds ? [nextIds] : []);

      return {
        nodes: updated,
        unlockedNodes: [...new Set([...state.unlockedNodes, ...toUnlock])],
        completedNodes: [...new Set([...state.completedNodes, nodeId])],
        dirty: true,
      };
    }),

  updateNodeData: (nodeId: string, data: Record<string, any>) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          data: { ...state.nodes[nodeId].data, ...data },
        },
      },
      dirty: true,
    })),

  unlockNode: (nodeId: string) =>
    set((state) => ({
      unlockedNodes: [...new Set([...state.unlockedNodes, nodeId])],
    })),

  setParadigmChoice: (choice: "A" | "B") =>
    set({ paradigmChoice: choice, dirty: true }),

  reset: () =>
    set({
      nodes: {},
      edges: [],
      unlockedNodes: ["step1"],
      completedNodes: [],
      paradigmChoice: null,
      dirty: false,
    }),
}));
