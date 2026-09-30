# Arquitetura para Agentes de IA

> Use este arquivo apenas quando o projeto for um **Sistema Web com Agente de IA**.
>
> Para extração de dados de documentos (OCR, tabelas, introspecção de templates),
> veja `docs/DOCUMENT_EXTRACTION.md` — o pipeline de ingestão → interpretação →
> validação vive lá.

## Stack de IA

- LLM provider configurável
- Temperatura configurável
- Top-p configurável
- Top-k configurável (quando suportado)
- System prompt versionado
- Tool calling
- Guardrails
- Orquestrador de ferramentas
- RAG com Pinecone
- Rerank com Cohere
- Logs de execução
- Observabilidade LLM

## Recomendados

- LangGraph ou Mastra para orquestração
- Inngest ou Trigger.dev para jobs assíncronos
- Upstash Redis para cache e rate limit
- Langfuse ou Helicone para observabilidade
- Zod para validar entradas e saídas das tools

## Regras para agentes

- Nunca executar ferramenta sem validar input.
- Toda tool deve ter schema Zod.
- Toda resposta crítica deve passar por guardrail.
- Logs devem registrar:
  - input
  - output
  - tool calls
  - tokens
  - custo estimado
  - erro (se houver)
- RAG deve citar fontes internas quando aplicável.
- Separar prompt de sistema, prompt de tarefa e contexto.
- Versionar prompts importantes.

## Gestão da janela de contexto

- **Orçamento de tokens**: monitorar proativamente a ocupação da janela para evitar
  estouro e custo excessivo.
- **Degradação suave**: sumarizar progressivamente as mensagens antigas do histórico
  ao se aproximar de ~80% do limite da janela.
- **Conversão prévia de documentos**: PDFs, planilhas e docs enviados ao agente devem
  ser convertidos para Markdown limpo antes do envio (ex.: MarkItDown). Evita mandar
  imagens pesadas ao modelo e economiza tokens.

## Contrato de Generative UI (componente vs. texto)

Quando o agente responde na interface, decide entre texto e componente React interativo:

**Renderizar componente interativo quando:**
- Seleção de data/agendamento → date picker / calendar.
- Dados numéricos estruturados ou séries temporais → gráficos (Recharts).
- Entrada/edição de dados → formulário (Zod + React Hook Form).

**Regras de segurança:**
- **Fallback estruturado**: todo componente interativo tem modo texto/markdown caso o
  carregamento de dados falhe.
- **Validação de props**: props do componente gerado são validadas via Zod antes de
  montar na árvore React.

## Anatomia do system prompt

Todo system prompt de agente/ferramenta segue estas 5 seções:

1. **Identidade** — nome, papel e limites do agente.
2. **Contexto** — dados da sessão, permissões do usuário, ambiente.
3. **Regras e restrições** — o que PODE e NÃO PODE fazer (guardrails explícitos).
4. **Esquema de saída** — estrutura JSON/Zod esperada da resposta.
5. **Exemplos few-shot** — casos de borda e respostas ideais para calibrar o comportamento.

## Estrutura sugerida

```txt
/src/ai
  /agents        → definições de agentes e grafos de estado
  /tools         → ferramentas executáveis com validação Zod
  /prompts       → system prompts versionados
  /rag           → conectores RAG e busca vetorial
  /guardrails    → verificações de segurança e filtros de saída
  /schemas       → schemas Zod de inputs e outputs
  /evaluations   → evals e casos de teste do agente
```

## Configuração esperada

O sistema deve permitir configurar:
- Modelo
- Temperatura
- Top-p
- Top-k
- Máximo de tokens
- Rerank on/off
- RAG on/off
- Guardrails on/off
