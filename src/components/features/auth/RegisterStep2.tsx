"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerStep2Schema } from "@/schemas/auth.schema";

interface Member {
  email: string;
  name: string;
}

interface RegisterStep2Props {
  onSubmit: (teamName: string, members: Member[]) => void;
  loading?: boolean;
}

export function RegisterStep2({ onSubmit, loading }: RegisterStep2Props) {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addMember = () => {
    if (!newMemberEmail || !newMemberName) return;

    setMembers([...members, { email: newMemberEmail, name: newMemberName }]);
    setNewMemberEmail("");
    setNewMemberName("");
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      registerStep2Schema.parse({
        teamName,
        members,
      });

      onSubmit(teamName, members);
    } catch (err) {
      if (err instanceof Error) {
        const parsed = JSON.parse(err.message);
        const newErrors: Record<string, string> = {};
        parsed.forEach((error: any) => {
          newErrors[error.path[0] || "general"] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dados da Equipe</CardTitle>
        <p className="text-sm text-slate-600 mt-1">Passo 2 de 2</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="teamName">Nome da Equipe</Label>
            <Input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ex: StartUp XYZ"
              required
            />
            {errors.teamName && <p className="text-sm text-red-600 mt-1">{errors.teamName}</p>}
          </div>

          <div>
            <Label>Integrantes</Label>
            <div className="space-y-3 mb-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Email do membro"
                />
                <Input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Nome do membro"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMember}
                  className="w-full"
                >
                  Adicionar Membro
                </Button>
              </div>

              {members.length > 0 && (
                <div className="space-y-2">
                  {members.map((member, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-slate-600">{member.email}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {errors.general && <p className="text-sm text-red-600">{errors.general}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
