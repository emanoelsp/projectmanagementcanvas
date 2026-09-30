import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Project Management Canvas
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-prose">
          Plataforma educacional para que alunos desenvolvam projetos de negócios de forma estruturada e gamificada.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg">Entrar</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline">Criar Conta</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
