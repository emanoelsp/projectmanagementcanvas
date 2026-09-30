"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { getTeam } from "@/services/team.service";
import { getCanvas } from "@/services/canvas.service";
import { Team, Canvas } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamCanvasPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { user } = useAuthStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "instructor") {
      return;
    }

    const loadData = async () => {
      try {
        const teamData = await getTeam(teamId);
        if (!teamData) {
          setError("Equipe não encontrada");
          return;
        }

        const canvasData = await getCanvas(teamId);
        setTeam(teamData);
        setCanvas(canvasData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, teamId]);

  if (!user || user.role !== "instructor") {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Você não tem permissão para acessar esta página.</p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-600">Carregando canvas...</p>
      </main>
    );
  }

  if (error || !team || !canvas) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Dados não encontrados"}</p>
          <Link href="/admin">
            <Button>Voltar ao Painel</Button>
          </Link>
        </div>
      </main>
    );
  }

  const progress = Math.round((canvas.completedNodes.length / 8) * 100);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">{team.name}</h1>
            <p className="text-slate-600 mt-2">Canvas - Visualização (Somente Leitura)</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Voltar</Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">{canvas.completedNodes.length}/8 passos concluídos</span>
                <span className="text-3xl font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nós Desbloqueados */}
          <Card>
            <CardHeader>
              <CardTitle>Nós Desbloqueados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {canvas.unlockedNodes.map((nodeId) => (
                  <li key={nodeId} className="text-sm flex items-center gap-2">
                    {canvas.completedNodes.includes(nodeId) ? (
                      <>✅ {nodeId}</>
                    ) : (
                      <>🔓 {nodeId}</>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Nós Completados */}
          <Card>
            <CardHeader>
              <CardTitle>Nós Completados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {canvas.completedNodes.map((nodeId) => (
                  <li key={nodeId} className="text-sm flex items-center gap-2">
                    ✅ {nodeId}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes dos Nós */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detalhes dos Nós</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {Object.values(canvas.nodes).map((node) => (
                <div key={node.id} className="border-l-4 border-blue-400 pl-4 pb-4">
                  <p className="font-semibold text-lg">{node.label}</p>
                  <p className="text-xs text-slate-600 mb-2">
                    {canvas.completedNodes.includes(node.id) ? "✅ Concluído" : "🔒 Pendente"}
                  </p>
                  <pre className="text-xs bg-slate-100 p-2 rounded overflow-x-auto max-h-32">
                    {JSON.stringify(node.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
