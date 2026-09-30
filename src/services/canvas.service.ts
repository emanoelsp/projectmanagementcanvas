import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Canvas, CanvasNode, CanvasEdge } from "@/types";

const CANVAS_COLLECTION = "PMC_canvas";

export async function initializeCanvas(teamId: string, nodes: Record<string, CanvasNode>, edges: CanvasEdge[]): Promise<void> {
  const canvas: Canvas = {
    teamId,
    nodes,
    edges,
    unlockedNodes: ["step1"],
    completedNodes: [],
    updatedAt: new Date(),
  };

  await setDoc(doc(db, CANVAS_COLLECTION, teamId), {
    ...canvas,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCanvas(teamId: string): Promise<Canvas | null> {
  const docSnap = await getDoc(doc(db, CANVAS_COLLECTION, teamId));
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    ...data,
    teamId,
    updatedAt: new Date(data.updatedAt),
  } as Canvas;
}

export async function saveCanvas(teamId: string, canvas: Partial<Canvas>): Promise<void> {
  await setDoc(
    doc(db, CANVAS_COLLECTION, teamId),
    {
      ...canvas,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
