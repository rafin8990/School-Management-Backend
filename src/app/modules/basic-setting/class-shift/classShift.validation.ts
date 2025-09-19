import { z } from 'zod';

const upsertClassShiftZodSchema = z.object({
  body: z.object({
    class_id: z.number().int().positive(),
    shift_ids: z.array(z.number().int().positive()).optional().nullable(),
    school_id: z.number().int().positive(),
  }),
});

const getByClassZodSchema = z.object({
  query: z.object({
    class_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
    school_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
  }),
});

export const ClassShiftValidation = {
  upsertClassShiftZodSchema,
  getByClassZodSchema,
};
