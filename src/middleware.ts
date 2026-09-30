import { NextResponse } from "next/server";

// Middleware simplificado - deixar o cliente gerenciar autenticação com Firebase
export function middleware() {
  // Apenas permitir requisições, o cliente validará com Firebase
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/canvas/:path*", "/admin/:path*"],
};
