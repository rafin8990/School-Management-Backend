import { z } from 'zod';

const listByReportZodSchema = z.object({
  query: z.object({
    school_id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'School ID must be positive').transform(Number),
    report_id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Report ID must be positive').transform(Number),
  }),
});

const upsertManyZodSchema = z.object({
  body: z.object({
    school_id: z.number().int().positive(),
    report_id: z.number().int().positive(),
    rows: z.array(z.object({
      signature_id: z.number().int().positive(),
      position: z.enum(['left','middle','right']).optional().nullable(),
      status: z.enum(['active','inactive']).default('inactive'),
    })),
  }),
});

export const SetSignatureValidation = { listByReportZodSchema, upsertManyZodSchema };


