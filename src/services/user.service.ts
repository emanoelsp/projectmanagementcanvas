import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { User } from "@/types";

const USERS_COLLECTION = "PMC_users";

export async function createUser(userId: string, email: string, name: string, role: "student" | "instructor" = "student"): Promise<User> {
  const user: User = {
    id: userId,
    email,
    name,
    role,
    createdAt: new Date(),
  };

  await setDoc(doc(db, USERS_COLLECTION, userId), {
    ...user,
    createdAt: new Date().toISOString(),
  });

  return user;
}

export async function getUser(userId: string): Promise<User | null> {
  const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    ...data,
    id: userId,
    createdAt: new Date(data.createdAt),
  } as User;
}

export async function updateUserTeam(userId: string, teamId: string): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, userId), { teamId });
}

export async function updateUserRole(userId: string, role: "student" | "instructor"): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, userId), { role });
}
