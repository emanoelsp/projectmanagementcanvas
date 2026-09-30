"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, team } = useAuthStore();

  if (!user || !team) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-600">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Bem-vindo, {user.name}!</h1>
        <p className="text-slate-600 mb-8">Equipe: <strong>{team.name}</strong></p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Integrantes da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {team.members.map((member, i) => (
                <li key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-slate-600">{member.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso do Canvas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">
              Complete os 8 passos do planejamento estratégico para finalizar seu projeto.
            </p>
            <Link href="/canvas">
              <Button size="lg">Abrir Canvas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
