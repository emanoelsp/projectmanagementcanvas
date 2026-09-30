import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Team, TeamMember } from "@/types";
import { v4 as uuidv4 } from "uuid";

const TEAMS_COLLECTION = "PMC_teams";

export async function createTeam(name: string, createdBy: string, members: TeamMember[]): Promise<Team> {
  const teamId = uuidv4();
  const memberEmails = members.map(m => m.email);
  const team: Team = {
    id: teamId,
    name,
    createdBy,
    members,
    memberEmails,
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
    memberEmails: data.memberEmails || data.members?.map((m: TeamMember) => m.email) || [],
    createdAt: new Date(data.createdAt),
  } as Team;
}

export async function addTeamMember(teamId: string, email: string, name: string, userId?: string): Promise<void> {
  const team = await getTeam(teamId);
  if (!team) throw new Error("Team not found");

  const updatedMembers = [...team.members];
  const existingIndex = updatedMembers.findIndex(m => m.email === email);

  if (existingIndex >= 0) {
    updatedMembers[existingIndex] = { ...updatedMembers[existingIndex], userId };
  } else {
    updatedMembers.push({ email, name, userId });
  }

  const updatedEmails = updatedMembers.map(m => m.email);

  await updateDoc(doc(db, TEAMS_COLLECTION, teamId), {
    members: updatedMembers,
    memberEmails: updatedEmails,
  });
}

export async function findTeamByMemberEmail(email: string): Promise<Team | null> {
  // Query usando campo flat memberEmails para array-contains funcionar corretamente
  const q = query(collection(db, TEAMS_COLLECTION), where("memberEmails", "array-contains", email));
  const docs = await getDocs(q);

  if (docs.empty) return null;

  const data = docs.docs[0].data();
  return {
    ...data,
    id: docs.docs[0].id,
    memberEmails: data.memberEmails || [],
    createdAt: new Date(data.createdAt),
  } as Team;
}

export async function getAllTeams(): Promise<Team[]> {
  const docs = await getDocs(collection(db, TEAMS_COLLECTION));
  return docs.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      memberEmails: data.memberEmails || data.members?.map((m: TeamMember) => m.email) || [],
      createdAt: new Date(data.createdAt),
    } as Team;
  });
}
