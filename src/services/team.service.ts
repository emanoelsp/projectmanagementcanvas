import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Team, TeamMember } from "@/types";
import { v4 as uuidv4 } from "uuid";

const TEAMS_COLLECTION = "PMC_teams";

export async function createTeam(name: string, createdBy: string, members: TeamMember[]): Promise<Team> {
  const teamId = uuidv4();
  const team: Team = {
    id: teamId,
    name,
    createdBy,
    members,
    createdAt: new Date(),
  };

  await setDoc(doc(db, TEAMS_COLLECTION, teamId), {
    ...team,
    createdAt: new Date().toISOString(),
  });

  return team;
}

export async function getTeam(teamId: string): Promise<Team | null> {
  const docSnap = await getDoc(doc(db, TEAMS_COLLECTION, teamId));
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    ...data,
    id: teamId,
    createdAt: new Date(data.createdAt),
  } as Team;
}

export async function addTeamMember(teamId: string, email: string, name: string, userId?: string): Promise<void> {
  const team = await getTeam(teamId);
  if (!team) throw new Error("Team not found");

  const updatedMembers = [...team.members];
  const existingIndex = updatedMembers.findIndex(m => m.email === email);

  if (existingIndex >= 0) {
    updatedMembers[existingIndex].userId = userId;
  } else {
    updatedMembers.push({ email, name, userId });
  }

  await updateDoc(doc(db, TEAMS_COLLECTION, teamId), { members: updatedMembers });
}

export async function findTeamByMemberEmail(email: string): Promise<Team | null> {
  const q = query(collection(db, TEAMS_COLLECTION), where("members", "array-contains", { email }));
  const docs = await getDocs(q);

  if (docs.empty) return null;

  const data = docs.docs[0].data();
  return {
    ...data,
    id: docs.docs[0].id,
    createdAt: new Date(data.createdAt),
  } as Team;
}

export async function getAllTeams(): Promise<Team[]> {
  const docs = await getDocs(collection(db, TEAMS_COLLECTION));
  return docs.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: new Date(data.createdAt),
    } as Team;
  });
}
