"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { getAllTeams } from "@/services/team.service";
import { getCanvas } from "@/services/canvas.service";
import { Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamWithProgress extends Team {
  progress: number;
  completedSteps: number;
}

export default function AdminPage() {
  const { user } = useAuthStore();
  const [teams, setTeams] = useState<TeamWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "instructor") {
      return;
    }

    const loadTeams = async () => {
      try {
        const allTeams = await getAllTeams();

        const teamsWithProgress = await Promise.all(
          allTeams.map(async (team) => {
            const canvas = await getCanvas(team.id);
            const completedSteps = canvas?.completedNodes.length || 0;
            const progress = Math.round((completedSteps / 8) * 100);

            return {
              ...team,
              progress,
              completedSteps,
            };
          })
        );

        setTeams(teamsWithProgress);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar equipes");
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, [user]);

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
        <p className="text-slate-600">Carregando equipes...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Painel do Instrutor</h1>
          <Link href="/dashboard">
            <Button variant="outline">← Dashboard</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {teams.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-600">Nenhuma equipe encontrada ainda.</p>
              </CardContent>
            </Card>
          ) : (
            teams.map((team) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{team.name}</CardTitle>
                      <p className="text-sm text-slate-600 mt-2">
                        Criado por: {team.createdBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{team.progress}%</div>
                      <p className="text-xs text-slate-600">
                        {team.completedSteps}/8 passos
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${team.progress}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      Integrantes ({team.members.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {team.members.map((member, i) => (
                        <div key={i} className="bg-slate-50 p-3 rounded">
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-slate-600">{member.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link href={`/admin/teams/${team.id}`}>
                      <Button className="w-full">Visualizar Canvas</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
