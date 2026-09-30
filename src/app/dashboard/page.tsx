"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addTeamMember } from "@/services/team.service";
import { getTeam } from "@/services/team.service";

function DashboardContent() {
  const { user, team, setTeam } = useAuthStore();
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  if (!user || !team) return null;

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    setAdding(true);
    setAddError("");
    try {
      await addTeamMember(team.id, newEmail.trim(), newName.trim());
      const updated = await getTeam(team.id);
      if (updated) setTeam(updated);
      setNewName("");
      setNewEmail("");
    } catch {
      setAddError("Erro ao adicionar membro. Tente novamente.");
    } finally {
      setAdding(false);
    }
  };

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
            {team.members.length === 0 ? (
              <p className="text-sm text-slate-500 mb-4">Nenhum integrante além de você. Adicione membros abaixo.</p>
            ) : (
              <ul className="space-y-2 mb-6">
                {team.members.map((member, i) => (
                  <li key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${member.userId ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {member.userId ? "Ativo" : "Aguardando cadastro"}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddMember} className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Adicionar integrante</p>
              <Input
                type="text"
                placeholder="Nome do membro"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email do membro"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
              />
              {addError && <p className="text-sm text-red-600">{addError}</p>}
              <Button type="submit" variant="outline" size="sm" disabled={adding} className="w-full">
                {adding ? "Adicionando..." : "+ Adicionar Membro"}
              </Button>
            </form>
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

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
