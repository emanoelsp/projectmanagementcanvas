import { z } from "zod";

/**
 * Schema alvo de exemplo: fatura.
 *
 * Padrão a copiar para novos tipos de documento:
 *  - tipar rigorosamente cada campo (nada de z.string() genérico onde há formato);
 *  - anexar proveniência aos campos críticos (dinheiro, datas, IDs);
 *  - marcar campos incertos com requerRevisaoHumana em vez de inventar valor.
 *
 * A saída do agente DEVE ser validada com este schema antes de qualquer persistência.
 * Ver docs/DOCUMENT_EXTRACTION.md e ../validator-rules.md.
 */

/** Origem de um valor extraído — obrigatória em campos críticos (anti-alucinação). */
export const ProvenanceSchema = z.object({
  pagina: z.number().int().positive(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  trecho: z.string().optional(),
});

const dataBR = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, "data deve estar em DD/MM/AAAA");

export const InvoiceItemSchema = z.object({
  descricao: z.string().min(1),
  quantidade: z.number().positive(),
  valorUnitario: z.number().nonnegative(),
});

export const InvoiceSchema = z
  .object({
    numero: z.string().min(1),
    emissao: dataBR,
    vencimento: dataBR,
    total: z.number().nonnegative(),
    itens: z.array(InvoiceItemSchema).min(1),

    // Campos críticos → proveniência obrigatória.
    proveniencia: z.object({
      numero: ProvenanceSchema,
      total: ProvenanceSchema,
      vencimento: ProvenanceSchema,
    }),

    // Fallback seguro quando o validator não confirma um obrigatório.
    requerRevisaoHumana: z.boolean().default(false),
  })
  .refine(
    (inv) => {
      const soma = inv.itens.reduce(
        (acc, i) => acc + i.quantidade * i.valorUnitario,
        0,
      );
      return Math.abs(soma - inv.total) <= 0.01;
    },
    { message: "soma dos itens diverge do total", path: ["total"] },
  );

export type Invoice = z.infer<typeof InvoiceSchema>;
