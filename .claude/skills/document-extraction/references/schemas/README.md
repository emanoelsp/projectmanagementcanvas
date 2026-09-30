# references/schemas

Schemas Zod **alvo**, um por tipo de documento estável e conhecido (fatura, contrato,
formulário padrão). São os contratos estritos que a extração deve preencher.

- Documento com layout fixo/conhecido → schema aqui.
- Documento com layout que muda por origem (multi-fornecedor, multi-escola) → o schema
  é aprendido em runtime e guardado em `../templates/` (schema topológico dinâmico).

## Convenções

- Tipagem rígida: use regex/refine para formato (datas, CPF/CNPJ, moeda), nunca
  `z.string()` cru onde há formato definido.
- Campos críticos (dinheiro, datas, IDs legais) carregam `proveniencia` (`pagina`+`bbox`).
- Sempre inclua `requerRevisaoHumana: z.boolean().default(false)` como fallback.
- Valide a saída do agente com o schema **antes** de persistir (Firestore/API).

Veja `invoice.example.ts` como modelo.
