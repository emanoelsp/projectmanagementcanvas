import { CanvasNode, CanvasEdge } from "@/types";

export const INITIAL_NODES: Record<string, CanvasNode> = {
  step1: {
    id: "step1",
    label: "Escopo",
    type: "input",
    data: { label: "Escopo", content: "" },
    position: { x: 400, y: 50 },
    completed: false,
    locked: false,
  },
  step2: {
    id: "step2",
    label: "Paradigma",
    type: "branching",
    data: { label: "Paradigma", choice: null },
    position: { x: 400, y: 250 },
    completed: false,
    locked: true,
  },
  step2a: {
    id: "step2a",
    label: "Oceano de Oportunidades",
    type: "input",
    data: { label: "Oceano de Oportunidades", content: "" },
    position: { x: 100, y: 450 },
    completed: false,
    locked: true,
  },
  step2b: {
    id: "step2b",
    label: "Novo Conceito",
    type: "input",
    data: { label: "Novo Conceito", content: "" },
    position: { x: 700, y: 450 },
    completed: false,
    locked: true,
  },
  step3: {
    id: "step3",
    label: "Análise de Mercado",
    type: "market",
    data: { label: "Análise de Mercado", audience: "", inspiration: "", competitor: "" },
    position: { x: 400, y: 650 },
    completed: false,
    locked: true,
  },
  step4: {
    id: "step4",
    label: "Dimensionamento (TAM/SAM/SOM)",
    type: "pyramid",
    data: { label: "Dimensionamento (TAM/SAM/SOM)", tam: "", sam: "", som: "" },
    position: { x: 400, y: 900 },
    completed: false,
    locked: true,
  },
  step5: {
    id: "step5",
    label: "Formatos e Monetização",
    type: "format",
    data: { label: "Formatos e Monetização", businessFormat: [], revenueFormats: [] },
    position: { x: 400, y: 1150 },
    completed: false,
    locked: true,
  },
  step6: {
    id: "step6",
    label: "Business Model Canvas",
    type: "bmc",
    data: {
      label: "Business Model Canvas",
      keyPartners: "",
      keyActivities: "",
      keyResources: "",
      valueProposition: "",
      customerSegments: "",
      customerRelationships: "",
      channels: "",
      costStructure: "",
      revenueStreams: "",
    },
    position: { x: 400, y: 1450 },
    completed: false,
    locked: true,
  },
  step7: {
    id: "step7",
    label: "Stack Tecnológica",
    type: "input",
    data: { label: "Stack Tecnológica", content: "" },
    position: { x: 400, y: 1800 },
    completed: false,
    locked: true,
  },
  step8: {
    id: "step8",
    label: "Protótipo Front-end",
    type: "input",
    data: { label: "Protótipo Front-end", content: "" },
    position: { x: 400, y: 2050 },
    completed: false,
    locked: true,
  },
};

export const INITIAL_EDGES: CanvasEdge[] = [
  { id: "e1-2", source: "step1", target: "step2", animated: true },
  { id: "e2-2a", source: "step2", target: "step2a", animated: true },
  { id: "e2-2b", source: "step2", target: "step2b", animated: true },
  { id: "e2-3", source: "step2", target: "step3", animated: true },
  { id: "e3-4", source: "step3", target: "step4", animated: true },
  { id: "e4-5", source: "step4", target: "step5", animated: true },
  { id: "e5-6", source: "step5", target: "step6", animated: true },
  { id: "e6-7", source: "step6", target: "step7", animated: true },
  { id: "e7-8", source: "step7", target: "step8", animated: true },
];

export const PARADIGM_OPTIONS = [
  {
    value: "A",
    label: "Novo Paradigma Tecnológico",
    description: "Inovação Radical/Disruptiva",
  },
  {
    value: "B",
    label: "Mudança de Paradigma",
    description: "Quebra/Ruptura do padrão atual",
  },
];

export const BUSINESS_FORMATS = [
  "B2B",
  "B2C",
  "B2B2C",
  "C2C",
  "D2C",
];

export const REVENUE_FORMATS = [
  "SaaS",
  "BaaS",
  "Pay-as-you-go",
  "Assinatura",
  "Freemium",
  "Venda Direta",
];
