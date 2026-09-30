export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "instructor";
  teamId?: string;
  createdAt: Date;
}

export interface TeamMember {
  email: string;
  name: string;
  userId?: string;
}

export interface Team {
  id: string;
  name: string;
  createdBy: string;
  members: TeamMember[];
  memberEmails: string[];
  createdAt: Date;
}

export interface CanvasNode {
  id: string;
  label: string;
  type: string;
  data: Record<string, any>;
  position: { x: number; y: number };
  completed: boolean;
  locked: boolean;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface Canvas {
  teamId: string;
  nodes: Record<string, CanvasNode>;
  edges: CanvasEdge[];
  unlockedNodes: string[];
  completedNodes: string[];
  paradigmChoice?: "A" | "B";
  updatedAt: Date;
}
