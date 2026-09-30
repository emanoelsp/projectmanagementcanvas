import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/authStore";
import { getUser } from "@/services/user.service";
import { getTeam } from "@/services/team.service";

export function useAuthPersist() {
  useEffect(() => {
    useAuthStore.setState({ loading: true });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const user = await getUser(firebaseUser.uid);
          if (user) {
            useAuthStore.setState({ user, loading: false });

            if (user.teamId) {
              const team = await getTeam(user.teamId);
              if (team) useAuthStore.setState({ team });
            }
          } else {
            useAuthStore.setState({ loading: false });
          }
        } else {
          useAuthStore.setState({ user: null, team: null, loading: false });
        }
      } catch (err) {
        console.error("Error restoring auth state:", err);
        useAuthStore.setState({ loading: false });
      }
    });

    return () => unsubscribe();
  }, []);
}
