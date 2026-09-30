"use client";

import { useAuthPersist } from "@/hooks/useAuthPersist";

export default function AuthInitializer() {
  useAuthPersist();
  return null;
}
