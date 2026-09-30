import { create } from "zustand";
import { User, Team } from "@/types";

interface AuthState {
  user: User | null;
  team: Team | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  setUser: (user: User | null) => void;
  setTeam: (team: Team | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  team: null,
  loading: true,
  error: null,
  hydrated: false,
  setUser: (user) => set({ user }),
  setTeam: (team) => set({ team }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setHydrated: (hydrated) => set({ hydrated }),
  reset: () => set({ user: null, team: null, error: null, loading: false }),
}));
