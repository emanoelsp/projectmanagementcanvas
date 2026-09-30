import Link from "next/link";
import { LoginForm } from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Project Management Canvas</h1>
          <p className="text-slate-600 mt-2">Acesse sua conta</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-slate-600">
          Não tem conta?{" "}
          <Link href="/auth/register" className="font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
