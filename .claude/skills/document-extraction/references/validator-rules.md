# Regras do Validator

Catálogo de verificações do passo 3 (validação). O Validator roda em duas camadas e,
ao falhar, devolve um erro **específico e localizado** para reparo pontual — nunca
descarta a extração inteira.

## Camada 1 — Regras determinísticas (baratas, rodam sempre)

### Conformidade de schema
- Todo campo obrigatório presente e com o tipo correto (validar via Zod/Pydantic).
- Rejeitar chaves extras não previstas no schema.

### Regex de formato (pt-BR)

| Campo | Regex / regra |
|-------|---------------|
| Data | `^\d{2}/\d{2}/\d{4}$` + data de calendário válida |
| CPF | 11 dígitos + validação de dígitos verificadores |
| CNPJ | 14 dígitos + validação de dígitos verificadores |
| Moeda (BRL) | `^\d{1,3}(\.\d{3})*,\d{2}$` ou número normalizado `>= 0` |
| E-mail | validação padrão de e-mail |
| CEP | `^\d{5}-?\d{3}$` |

### Consistência aritmética
- `soma(itens.quantidade × itens.valorUnitario)` == `total` (tolerância de arredondamento ≤ 0.01).
- `vencimento >= emissao`.
- Percentuais somam 100% quando o campo assim exigir.

### Proveniência
- Todo campo crítico (dinheiro, data, ID legal) tem `_proveniencia` com `pagina` e `bbox`.
- Sem proveniência → campo é inválido por definição.

## Camada 2 — LLM-as-a-judge (semântica, só quando a camada 1 passa)

Peça ao juiz para apontar **inconsistências lógicas** que regras não pegam:

- Valores plausíveis para o tipo de documento (ex.: total negativo, data futura absurda).
- Divergência entre o documento e um contrato/padrão de referência.
- Campos que "batem no formato" mas fazem parte de outra seção (rótulo trocado).
- Ambiguidade: dois candidatos para o mesmo campo → sinalizar para revisão.

O juiz retorna: `{ campo, veredito: "ok" | "suspeito" | "invalido", motivo }`.

## Loop de reparo

```
para cada campo com veredito "invalido"/"suspeito":
  reinjetar { campo, valor_atual, motivo, line-entities candidatas } no executor
  executor corrige APENAS aquele campo
repetir até: todos os obrigatórios "ok"  OU  atingir MAX_ITERACOES
```

- Defina `MAX_ITERACOES` (sugestão: 3–5) para evitar loop infinito.
- Se um obrigatório continuar inválido no fim → marcar `requer_revisao_humana: true`.
  **Nunca inventar valor.**

## Anti-alucinação (não negociável)

- Números críticos vêm do OCR determinístico; o LLM só classifica o contexto.
- Se o valor extraído não tem line-entity de origem correspondente, é alucinação → rejeitar.
