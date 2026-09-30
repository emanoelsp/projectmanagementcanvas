import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/authStore";
import { getUser, updateUserTeam } from "@/services/user.service";
import { getTeam, findTeamByMemberEmail, addTeamMember } from "@/services/team.service";

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
            } else {
              // Buscar equipe pelo email — usuário pode ter sido pré-adicionado como membro
              const team = await findTeamByMemberEmail(user.email);
              if (team) {
                await updateUserTeam(user.id, team.id);
                await addTeamMember(team.id, user.email, user.name, user.id);
                useAuthStore.setState({
                  user: { ...user, teamId: team.id },
                  team,
                });
              }
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
