# references/templates

**Schemas topológicos dinâmicos** aprendidos por origem, quando o layout muda de um
emissor para outro (múltiplos fornecedores, múltiplas escolas). Em vez de hardcodar
cada layout na aplicação, o agente analisa o template uma vez (via visão multimodal),
gera o mapa `posição → campo` e salva aqui — reutilizável nas próximas extrações
daquela origem.

## Fluxo de introspecção

1. Upload de um template (vazio ou preenchido de exemplo).
2. Agente infere a topologia: cada região vira um campo com bbox e rótulo.
3. Salvar como `<origem>.json` (ver `lesson-plan.example.json`).
4. Nas próximas extrações dessa origem, carregar o schema salvo e pular a introspecção.
5. Para devolver o documento preenchido, fundir o JSON gerado nos bbox mapeados.

## Esquema do arquivo

```ts
interface TopologicalTemplate {
  origem: string;                 // identificador da escola/fornecedor
  versao: string;                 // versionar quando o layout mudar
  campos: Array<{
    chave: string;                // nome do campo no JSON de saída
    rotulo: string;               // texto do rótulo no documento
    numPagina: number;
    bbox: [number, number, number, number];
    tipo: "texto" | "data" | "numero" | "lista" | "tabela";
    obrigatorio: boolean;
  }>;
}
```

Cada arquivo aqui deve ter um schema Zod equivalente (gerado a partir de `campos`)
para validar a extração — as mesmas regras de `../schemas` se aplicam.
