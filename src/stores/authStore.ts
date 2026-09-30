import { create } from "zustand";
import { User, Team } from "@/types";

interface AuthState {
  user: User | null;
  team: Team | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setTeam: (team: Team | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  team: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setTeam: (team) => set({ team }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ user: null, team: null, error: null }),
}));
