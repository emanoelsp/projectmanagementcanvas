"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { getCanvas } from "@/services/canvas.service";
import { CanvasContainer } from "@/components/canvas/CanvasContainer";
import { INITIAL_NODES, INITIAL_EDGES } from "@/lib/canvas-config";
import { Button } from "@/components/ui/button";

export default function CanvasPage() {
  const { team } = useAuthStore();
  const { initCanvas, nodes } = useCanvasStore();

  useEffect(() => {
    if (!team) return;

    const loadCanvas = async () => {
      try {
        const canvas = await getCanvas(team.id);
        if (canvas) {
          initCanvas(
            canvas.nodes,
            canvas.edges,
            canvas.unlockedNodes,
            canvas.completedNodes,
            canvas.paradigmChoice
          );
        } else {
          initCanvas(INITIAL_NODES, INITIAL_EDGES, ["step1"], []);
        }
      } catch (err) {
        console.error("Error loading canvas:", err);
        initCanvas(INITIAL_NODES, INITIAL_EDGES, ["step1"], []);
      }
    };

    loadCanvas();
  }, [team, initCanvas]);

  if (!nodes || Object.keys(nodes).length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-600">Carregando canvas...</p>
      </main>
    );
  }

  const initialNodesArray = Object.values(nodes).map(node => ({
    ...node,
    position: node.position || { x: 0, y: 0 },
  }));

  return (
    <main className="w-full h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{team?.name || "Canvas"}</h1>
        <Link href="/dashboard">
          <Button variant="outline">← Voltar</Button>
        </Link>
      </header>

      <div className="flex-1">
        <CanvasContainer
          initialNodes={initialNodesArray}
          initialEdges={Object.values(INITIAL_EDGES)}
        />
      </div>
    </main>
  );
}
