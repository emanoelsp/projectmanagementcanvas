import { z } from "zod";

export const canvasNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string(),
  data: z.record(z.any()).default({}),
  position: z.object({ x: z.number(), y: z.number() }),
  completed: z.boolean().default(false),
  locked: z.boolean().default(true),
});

export const canvasEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  animated: z.boolean().optional(),
});

export const canvasDocSchema = z.object({
  teamId: z.string(),
  nodes: z.record(canvasNodeSchema),
  edges: z.array(canvasEdgeSchema),
  unlockedNodes: z.array(z.string()),
  completedNodes: z.array(z.string()),
  paradigmChoice: z.enum(["A", "B"]).optional(),
  updatedAt: z.date(),
});

export type CanvasNode = z.infer<typeof canvasNodeSchema>;
export type CanvasEdge = z.infer<typeof canvasEdgeSchema>;
export type CanvasDoc = z.infer<typeof canvasDocSchema>;
