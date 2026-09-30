import { CanvasNode, CanvasEdge } from "@/types";

export const INITIAL_NODES: Record<string, CanvasNode> = {
  step1: {
    id: "step1",
    label: "Escopo",
    type: "input",
    data: { label: "Escopo em uma frase", content: "", description: "Defina em uma frase o produto, serviço ou solução que sua startup pretende criar." },
    position: { x: 400, y: 50 },
    completed: false,
    locked: false,
  },
  step2: {
    id: "step2",
    label: "Paradigma",
    type: "branching",
    data: { label: "Paradigma", choice: null, description: "Escolha o tipo de inovação: Novo Paradigma Tecnológico (inovação radical) ou Mudança de Paradigma (ruptura de modelo existente)." },
    position: { x: 400, y: 250 },
    completed: false,
    locked: true,
  },
  step2a: {
    id: "step2a",
    label: "Oceano de Oportunidades",
    type: "input",
    data: { label: "Oceano de Oportunidades", content: "", description: "Descreva o espaço de mercado inexplorado que sua inovação tecnológica irá ocupar. Deriva do Novo Paradigma Tecnológico." },
    position: { x: 100, y: 450 },
    completed: false,
    locked: true,
  },
  step2b: {
    id: "step2b",
    label: "Novo Modelo de Negócio",
    type: "input",
    data: { label: "Novo Modelo de Negócio", content: "", description: "Descreva como seu novo modelo de negócio rompe com o padrão atual do mercado. Deriva da Mudança de Paradigma." },
    position: { x: 700, y: 450 },
    completed: false,
    locked: true,
  },
  step3: {
    id: "step3",
    label: "Análise de Mercado",
    type: "market",
    data: { label: "Análise de Mercado", audience: "", inspiration: "", competitor: "", description: "Identifique quem é seu público-alvo e, dependendo do paradigma escolhido, qual a inspiração (opção A) ou o principal concorrente (opção B)." },
    position: { x: 400, y: 650 },
    completed: false,
    locked: true,
  },
  step4: {
    id: "step4",
    label: "Dimensionamento (TAM/SAM/SOM)",
    type: "pyramid",
    data: { label: "Dimensionamento (TAM/SAM/SOM)", tam: "", sam: "", som: "", description: "TAM = mercado total disponível | SAM = mercado que você pode atingir | SOM = mercado realista no curto prazo." },
    position: { x: 400, y: 900 },
    completed: false,
    locked: true,
  },
  step5: {
    id: "step5",
    label: "Formatos e Monetização",
    type: "format",
    data: { label: "Formatos e Monetização", businessFormat: [], revenueFormats: [], description: "Defina como sua startup se posiciona (B2B, B2C etc.) e como vai gerar receita (SaaS, Assinatura, Freemium etc.)." },
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
      description: "Preencha os 9 blocos do BMC para descrever como seu negócio cria, entrega e captura valor.",
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
    data: { label: "Stack Tecnológica", content: "", description: "Liste as tecnologias, plataformas e ferramentas que serão usadas para construir a solução." },
    position: { x: 400, y: 1800 },
    completed: false,
    locked: true,
  },
  step8: {
    id: "step8",
    label: "Protótipo Front-end",
    type: "input",
    data: { label: "Protótipo Front-end", content: "", description: "Descreva ou cole o link do protótipo visual da interface (Figma, wireframe etc.)." },
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
