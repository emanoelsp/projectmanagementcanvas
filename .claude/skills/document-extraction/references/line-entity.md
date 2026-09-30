# Formato line-entity

Representação compacta do OCR usada para alimentar o LLM no passo de interpretação.
Cada linha do documento vira um objeto leve com metadados espaciais mínimos — em vez
de mandar Markdown pesado, JSON bruto ou a imagem inteira (que custam muito mais tokens).

## Esquema

```ts
interface LineEntity {
  conteudo: string;          // texto da linha
  numPagina: number;         // página 1-based
  bbox: [number, number, number, number]; // [x0, y0, x1, y1] em pontos ou px
  tipoBloco: BlocoTipo;      // classificação do bloco
}

type BlocoTipo =
  | "titulo"
  | "paragrafo"
  | "celula"       // célula de tabela
  | "cabecalho"    // header de tabela/página
  | "rodape"
  | "campo"        // rótulo/valor de formulário
  | "assinatura"
  | "imagem";      // legenda ou marcador de área visual
```

## Exemplo

Trecho de uma fatura →

```json
[
  { "conteudo": "Fatura Nº 2024-0091", "numPagina": 1, "bbox": [40, 40, 260, 62], "tipoBloco": "titulo" },
  { "conteudo": "Vencimento", "numPagina": 1, "bbox": [40, 120, 130, 138], "tipoBloco": "campo" },
  { "conteudo": "15/10/2024", "numPagina": 1, "bbox": [140, 120, 240, 138], "tipoBloco": "campo" },
  { "conteudo": "Item", "numPagina": 1, "bbox": [40, 200, 100, 218], "tipoBloco": "cabecalho" },
  { "conteudo": "Qtd", "numPagina": 1, "bbox": [300, 200, 340, 218], "tipoBloco": "cabecalho" },
  { "conteudo": "Serviço de consultoria", "numPagina": 1, "bbox": [40, 230, 260, 248], "tipoBloco": "celula" },
  { "conteudo": "10", "numPagina": 1, "bbox": [300, 230, 340, 248], "tipoBloco": "celula" }
]
```

## Regras de conversão

- **Ordem de leitura**: ordene por `numPagina`, depois `y0`, depois `x0`. Layouts em
  colunas exigem agrupar por coluna antes de ordenar por `y`.
- **Preservar bbox sempre**: é a base da proveniência (campos críticos) e do Table
  Resolver (alinhamento de células por coordenada).
- **Não normalizar o texto** nesta etapa (não corrigir OCR, não formatar números).
  A limpeza é responsabilidade semântica do passo de interpretação.
- **tipoBloco é uma dica, não verdade absoluta** — o classificador do OCR erra;
  o LLM pode reclassificar durante a interpretação.

## Por que economiza tokens

Uma fatura de 1 página em Markdown com layout preservado pode custar milhares de
tokens; em line-entity, só o texto + 4 números por linha. E a imagem rasterizada
equivalente custa ordens de magnitude mais. Mande imagem só nos recortes que o
line-entity não resolve (ver camada C em `docs/DOCUMENT_EXTRACTION.md`).
