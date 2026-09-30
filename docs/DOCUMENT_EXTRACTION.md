# Extração e Interpretação de Documentos

> Use este documento quando o projeto precisar **ler documentos** (PDF, scans,
> imagens, Office) e transformá-los em **dados estruturados** — faturas, contratos,
> formulários, relatórios ou templates institucionais.

O objetivo é extrair dados confiáveis de layouts irregulares (tabelas complexas,
referências cruzadas, formulários não padronizados) sem alucinação em campos
críticos e sem estourar o orçamento de tokens.

Baseado na arquitetura agêntica de extração (padrão AID-agent: Executor + Tool Pool
+ Validator) e no padrão de Agent Skills da Anthropic.

---

## Princípio central: desacoplar em 3 passos

Nunca tente extrair, interpretar e validar tudo em um único prompt gigante.
O fluxo seguro separa responsabilidades:

1. **Ingestão (determinística)** — extrair texto/estrutura preservando a posição
   dos blocos. Sem LLM, sem alucinação.
2. **Interpretação (semântica)** — o LLM raciocina sobre o texto já extraído,
   resolve tabelas/referências e popula o schema.
3. **Validação (crítica)** — regras + LLM-as-a-judge conferem o resultado e
   devolvem erros específicos para reparo pontual.

Essa separação otimiza custo de tokens, reduz latência e isola o ponto onde
alucinação pode ocorrer (apenas o passo 2, sob controle do validador).

---

## Formato nativo antes de OCR

OCR é o **último** recurso, não o primeiro. Escolha o pipeline pela entrada:

- **Formato estruturado nativo** (`.docx`, `.xlsx`, HTML): parseie a estrutura direto
  (lossless). **Sem OCR** — texto e tabelas já são legíveis por máquina.
- **PDF com camada de texto**: extraia o texto direto.
- **PDF-imagem / scan / foto**: só aqui entra OCR/VLM (Passo 1 abaixo).

## Introspecção ≠ saída (fidelidade de round-trip)

Separe **aprender o template** (introspecção → campos/schema) de **produzir a saída**:

- Para devolver o documento no layout original, faça **round-trip no formato nativo**
  (ex.: injetar valores no `.docx` via OOXML). **Nunca** reconstrua o layout final a
  partir de OCR/PDF — perde fidelidade.
- Um exemplo já preenchido (mesmo em PDF) serve para **aprender a semântica** dos
  campos, não como substrato de saída.
- Extração de campos ("chips") de alta qualidade: casar hipótese determinística
  (rótulo + coordenada) com cross-check do LLM, atribuir **score de confiança** por
  campo e mandar os de baixa confiança para **revisão humana** — nunca inventar valor.

---

## Passo 1 — OCR híbrido (cascata de fallback)

> Este passo é o ramo **OCR/imagem**. Para formato nativo, pule a ingestão OCR e
> parseie a estrutura direto, mantendo introspecção e validação.

Prefira sempre a camada mais barata e determinística que resolver o documento.
Só suba de camada quando a anterior falhar:

### Camada A — Parser/OCR local e determinístico
- PDFs com camada de texto, Office e scans limpos: extrair via parser local
  (ex.: Kreuzberg, `pdfplumber`, Tesseract, PaddleOCR).
- Sem custo de API, sem latência externa, resultado reproduzível.

### Camada B — Representação line-entity
- Converter o resultado do OCR num formato compacto por linha, com metadados
  espaciais mínimos:

  ```
  { conteudo | numPagina | coordenadas(bbox) | tipoBloco }
  ```

- Reduz drasticamente o consumo de tokens vs. enviar Markdown pesado, JSON bruto
  ou a imagem inteira. É essa representação que vai para o LLM no passo 2.

### Camada C — VLM pontual (visão)
- Acionar um modelo multimodal (Claude com visão) **apenas em recortes**
  (bounding boxes) de regiões ilegíveis, rotacionadas, manuscritas ou tabelas
  altamente irregulares.
- Nunca mandar o documento inteiro como imagem por padrão — é o caminho mais caro
  e o último recurso.

---

## Passo 2 — Interpretação semântica

Com o texto em line-entity, o LLM estrutura os dados. Ferramentas dedicadas
(chamadas via tool use) resolvem os casos difíceis:

- **Table Resolver** — reconstrói tabelas complexas a partir do texto+coordenadas,
  permitindo consulta tipo SQL às células (alinhamento por linha/coluna via bbox).
- **Reference Resolver** — conecta informações referenciadas entre seções
  (rodapés, anexos, "ver item 3.2") usando busca por palavra-chave + embeddings.
- **Custom Tools** — regras de domínio plugáveis (validação de CNPJ, interpretação
  de composição química, checagem de pictogramas, diretrizes de especialista).

### Rastreabilidade / proveniência (obrigatório em campos críticos)

Todo valor extraído deve carregar sua origem: `{ valor, pagina, bbox, trecho }`.
Isso permite auditoria humana e é o que garante **zero alucinação** em números
financeiros, datas de vencimento e identificadores legais.

---

## Passo 3 — Validator loop (reparo guiado por validador)

A primeira extração nunca é a final. A cada iteração o Validator:

1. **Regras determinísticas** — conformidade com o JSON Schema, regex de formato
   (datas, CPF/CNPJ, moeda), somatórios (itens × total).
2. **LLM-as-a-judge** — inconsistências lógicas (ex.: valor unitário × quantidade
   diverge do total; cláusula contraria o contrato padrão).
3. **Reparo pontual** — se um campo falha, o erro específico é reinjetado no
   executor para corrigir **só aquele campo**, não a extração inteira.

O loop termina quando todos os campos obrigatórios validam **ou** ao atingir o
limite de iterações (defina um teto para evitar loop infinito).

---

## Introspecção de templates (aprendizado dinâmico de layout)

Para quando o agente precisa **aprender e reproduzir** um layout novo (templates de
múltiplos fornecedores/instituições) sem hardcoding:

1. **Inferência de schema topológico** — analisar a estrutura visual de um template
   (vazio ou preenchido) via visão multimodal e gerar um mapa dinâmico das relações
   posição → campo. Ex.: "célula no topo = Competências; caixa inferior = Avaliação".
2. **Schema dinâmico por origem** — cada template vira um schema próprio,
   eliminando mapeamento manual na aplicação.
3. **Injeção de volta no layout** — o conteúdo estruturado gerado (JSON) é fundido
   ao layout original, devolvendo o documento preenchido no padrão institucional.

> Exemplo (PlanoMagistral/Magis): o coordenador sobe o template da escola, o agente
> cataloga os campos exigidos (BNCC, estratégias de avaliação, recursos), e a
> assistente gera o plano de aula já no formato daquela escola.

---

## Enforcement de schema estrito (nunca texto livre)

- **Proibido** pedir "retorne em JSON" via prompt e torcer pelo resultado.
- Use **tool use / function calling** com schema estrito. Validação obrigatória via
  **Zod** (TypeScript) ou **Pydantic** (Python) antes de qualquer persistência.
- Tipagem rígida garante que a saída entra direto em Firestore/API sem parsing frágil.

```typescript
// exemplo de schema alvo (Zod)
const InvoiceSchema = z.object({
  numero: z.string(),
  emissao: z.string().date(),
  vencimento: z.string().date(),
  total: z.number().positive(),
  itens: z.array(z.object({
    descricao: z.string(),
    quantidade: z.number(),
    valorUnitario: z.number(),
  })),
  _proveniencia: z.record(z.object({ pagina: z.number(), bbox: z.array(z.number()) })),
});
```

---

## Arquitetura de referência

| Componente | Papel |
|------------|-------|
| **Executor** | LLM que planeja e decide qual ferramenta chamar (paradigma ReAct) |
| **Tool Pool** | Table Resolver, Reference Resolver, Vision Analysis, Custom Tools |
| **Validator** | Regras + LLM-as-a-judge; gera feedback para o loop de reparo |

Entrada: documento + JSON Schema alvo. Saída: JSON preenchido, validado e com
proveniência.

### Estrutura de pastas sugerida

```txt
/src/extraction
  /ingest        → parsers/OCR locais + conversão line-entity
  /tools         → table-resolver, reference-resolver, vision, custom
  /schemas       → schemas Zod alvo por tipo de documento/template
  /templates     → schemas topológicos aprendidos por origem
  /validator     → regras determinísticas + juiz LLM
  /pipeline      → orquestração do loop (executor)
```

---

## Anti-alucinação (regras duras)

- Campos críticos (dinheiro, datas, IDs legais) **nunca** dependem só do OCR
  preditivo do LLM: use OCR determinístico para o dígito e o LLM só para o contexto.
- Todo campo crítico exige proveniência (`pagina` + `bbox`).
- Se o validador não conseguir confirmar um campo obrigatório após o teto de
  iterações, **marque como "requer revisão humana"** — nunca invente valor.
