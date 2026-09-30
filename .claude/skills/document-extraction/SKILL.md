---
name: document-extraction
description: Extrai dados estruturados de documentos (PDF, scans, imagens, Office) com OCR híbrido, resolução de tabelas/referências, introspecção de templates e validação estrita via schema. Use ao ler faturas, contratos, formulários, relatórios ou templates institucionais e transformá-los em JSON confiável.
---

# Document Extraction

Pipeline agêntico de extração de documentos. Segue o desacoplamento em 3 passos
descrito em `docs/DOCUMENT_EXTRACTION.md` (leia esse doc para as regras completas).

## Quando usar

- Transformar um documento não estruturado em JSON tipado.
- Aprender o layout de um template novo e reproduzi-lo.
- Extrair campos com garantia de proveniência (página + coordenadas).

## Escolha do pipeline por entrada (formato nativo antes de OCR)

OCR é o **último** recurso, não o primeiro. Escolha pela entrada:

- **Formato estruturado nativo** (`.docx`, `.xlsx`, HTML): parseie a estrutura
  direto (lossless). **Sem OCR** — o texto e as tabelas já estão legíveis.
- **PDF com camada de texto**: extraia o texto direto.
- **PDF-imagem / scan / foto**: só aqui entra OCR/VLM (o fluxo abaixo).

## Introspecção ≠ saída (fidelidade)

Separe **aprender o template** (introspecção → campos/schema) de **produzir a saída**:

- Para devolver o documento no layout original, faça **round-trip no formato nativo**
  (ex.: injetar valores no `.docx`). Nunca reconstrua o layout final a partir de
  OCR/PDF — perde fidelidade.
- Um exemplo já preenchido (mesmo em PDF) serve para **aprender a semântica** dos
  campos, não como substrato de saída.

## Fluxo (Nível 2 — procedimento)

> O fluxo abaixo é o ramo **OCR/imagem**. Para formato nativo, pule a ingestão OCR e
> parseie a estrutura direto, mantendo os passos de introspecção e validação.

1. **Identificar o schema alvo.** Se existir em `references/schemas/`, carregue-o.
   Se for um template novo, rode a introspecção topológica primeiro (passo 5).
2. **Ingestão determinística.** Extraia texto com parser/OCR local. Converta para
   `line-entity`: `{ conteudo | numPagina | bbox | tipoBloco }`. Só mande isso ao LLM.
3. **Interpretação.** Popule o schema. Para tabelas complexas, use o Table Resolver;
   para referências cruzadas, o Reference Resolver. Acione VLM (visão) **só** em
   recortes ilegíveis/irregulares.
4. **Validação (loop).** Rode as regras determinísticas + juiz LLM. Se um campo
   falhar, reinjete o erro e repare **só aquele campo**. Pare quando tudo validar
   ou ao atingir o teto de iterações.
5. **Introspecção de template (se layout novo).** Analise a estrutura visual, gere
   o mapa posição→campo, salve como schema dinâmico em `references/templates/`.

## Regras duras

- Nunca peça "retorne JSON" por prompt: use tool use + validação Zod/Pydantic.
- Campos críticos (dinheiro, datas, IDs) exigem proveniência (`pagina` + `bbox`).
- Se não der para confirmar um campo obrigatório, marque `requer_revisao_humana` —
  nunca invente valor.

## Recursos (Nível 3 — carregar sob demanda)

- `references/schemas/` — schemas Zod alvo por tipo de documento.
- `references/templates/` — schemas topológicos aprendidos por origem.
- `references/line-entity.md` — formato detalhado e exemplos de conversão.
- `references/validator-rules.md` — catálogo de regras determinísticas e regex.
