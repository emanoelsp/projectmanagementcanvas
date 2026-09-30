"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/authStore";
import { createUser } from "@/services/user.service";
import { createTeam, findTeamByMemberEmail, addTeamMember } from "@/services/team.service";
import { initializeCanvas } from "@/services/canvas.service";
import { INITIAL_NODES, INITIAL_EDGES } from "@/lib/canvas-config";
import { RegisterStep1 } from "@/components/features/auth/RegisterStep1";
import { RegisterStep2 } from "@/components/features/auth/RegisterStep2";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, setTeam } = useAuthStore();

  const handleStep1 = (newName: string, newEmail: string, newPassword: string) => {
    setName(newName);
    setEmail(newEmail);
    setPassword(newPassword);
    setStep(2);
  };

  const handleStep2 = async (teamName: string, members: Array<{ email: string; name: string }>) => {
    setError("");
    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = credential.user.uid;

      const user = await createUser(userId, email, name, "student");
      setUser(user);

      let team;
      const existingTeam = await findTeamByMemberEmail(email);

      if (existingTeam) {
        team = existingTeam;
        await addTeamMember(team.id, email, user.name, userId);
      } else {
        team = await createTeam(teamName, userId, [
          { email, name: user.name, userId },
          ...members.map(m => ({ email: m.email, name: m.name })),
        ]);
      }

      setTeam(team);

      await initializeCanvas(team.id, INITIAL_NODES, INITIAL_EDGES);

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Project Management Canvas</h1>
          <p className="text-slate-600 mt-2">Crie sua conta e começe a planejar</p>
        </div>

        {error && <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded">{error}</p>}

        {step === 1 && <RegisterStep1 onNext={handleStep1} loading={loading} />}
        {step === 2 && <RegisterStep2 onSubmit={handleStep2} loading={loading} />}

        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="w-full text-center text-sm text-slate-600 hover:underline"
          >
            Voltar
          </button>
        )}
      </div>
    </main>
  );
}
