import { z } from 'zod';

const createZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(1),
    mark_position: z.number().int(),
    view_position: z.number().int().optional().nullable(),
    status: z.enum(['active', 'inactive']).default('active'),
    school_id: z.number().int().positive(),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    mark_position: z.number().int().optional(),
    view_position: z.number().int().optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const getAllZodSchema = z.object({
  query: z.object({
    school_id: z
      .string()
      .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'School ID must be positive')
      .transform(Number),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const idParamZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'ID must be positive'),
  }),
});

export const ShortCodeValidation = {
  createZodSchema,
  updateZodSchema,
  getAllZodSchema,
  idParamZodSchema,
};


