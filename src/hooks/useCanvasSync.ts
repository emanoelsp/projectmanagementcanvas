import { useEffect, useRef } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { saveCanvas } from "@/services/canvas.service";

export function useCanvasSync(teamId: string | undefined) {
  const { nodes, edges, unlockedNodes, completedNodes, paradigmChoice, nodeStyles, dirty } =
    useCanvasStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!dirty || !teamId) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await saveCanvas(teamId, {
          nodes,
          edges,
          unlockedNodes,
          completedNodes,
          paradigmChoice: paradigmChoice ?? undefined,
          nodeStyles,
        } as any);
        useCanvasStore.setState({ dirty: false });
      } catch (err) {
        console.error("Erro ao salvar canvas:", err);
      }
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dirty, teamId, nodes, edges, unlockedNodes, completedNodes, paradigmChoice, nodeStyles]);
}
