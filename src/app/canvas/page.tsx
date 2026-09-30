"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { getCanvas } from "@/services/canvas.service";
import { CanvasContainer } from "@/components/canvas/CanvasContainer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { INITIAL_NODES, INITIAL_EDGES } from "@/lib/canvas-config";
import { useCanvasSync } from "@/hooks/useCanvasSync";
import { Button } from "@/components/ui/button";

function CanvasContent() {
  const { team } = useAuthStore();
  const { initCanvas, nodes, unlockedNodes, nodeStyles } = useCanvasStore();

  // Persiste automaticamente 800ms após qualquer mudança
  useCanvasSync(team?.id);

  useEffect(() => {
    if (!team) return;

    const loadCanvas = async () => {
      try {
        const canvas = await getCanvas(team.id);
        if (canvas) {
          // Garante que descrições e exemplos atualizados sejam sempre exibidos nos tooltips
          const mergedNodes = { ...canvas.nodes };
          Object.keys(INITIAL_NODES).forEach((id) => {
            if (mergedNodes[id]) {
              mergedNodes[id] = {
                ...mergedNodes[id],
                data: {
                  ...mergedNodes[id].data,
                  description: INITIAL_NODES[id].data.description,
                },
              };
            } else {
              mergedNodes[id] = INITIAL_NODES[id];
            }
          });

          // Garante compatibilidade caso step2 já estivesse desbloqueado
          const updatedUnlocked = [...canvas.unlockedNodes];
          if (updatedUnlocked.includes("step2") && !updatedUnlocked.includes("step2_innovation")) {
            updatedUnlocked.push("step2_innovation");
          }

          // Garante que a nova edge e2-innovation exista
          const mergedEdges = [...canvas.edges];
          if (!mergedEdges.some(e => e.id === "e2-innovation")) {
            const defaultEdge = INITIAL_EDGES.find(e => e.id === "e2-innovation");
            if (defaultEdge) mergedEdges.push(defaultEdge);
          }

          initCanvas(
            mergedNodes,
            mergedEdges,
            updatedUnlocked,
            canvas.completedNodes,
            canvas.paradigmChoice,
            canvas.nodeStyles
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

  if (!team) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Você não está vinculado a nenhuma equipe.</p>
          <Link href="/dashboard">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!nodes || Object.keys(nodes).length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-600">Carregando canvas...</p>
      </main>
    );
  }

  // Filtra apenas nós desbloqueados antes de passar ao ReactFlow,
  // garantindo que fitView posiciona a viewport corretamente desde o início
  const initialNodesArray = Object.values(nodes)
    .filter(node => unlockedNodes.includes(node.id))
    .map(node => {
      const style = nodeStyles[node.id];
      return {
        ...node,
        position: node.position || { x: 0, y: 0 },
        width: style?.width,
        height: style?.height,
        style: style?.width ? { width: style.width, height: style.height } : undefined,
        data: {
          ...node.data,
          locked: false,
          nodeStyle: style || undefined,
        },
      };
    });

  return (
    <main className="w-full h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{team.name}</h1>
        <Link href="/dashboard">
          <Button variant="outline">← Voltar</Button>
        </Link>
      </header>

      <div className="flex-1">
        <CanvasContainer
          initialNodes={initialNodesArray}
          initialEdges={INITIAL_EDGES}
          teamName={team.name}
        />
      </div>
    </main>
  );
}

export default function CanvasPage() {
  return (
    <ProtectedRoute>
      <CanvasContent />
    </ProtectedRoute>
  );
}
