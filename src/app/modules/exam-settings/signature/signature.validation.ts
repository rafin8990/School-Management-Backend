import { z } from 'zod';

const createZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name cannot be empty'),
    image: z.string().url('Invalid image URL').optional().nullable(),
    status: z.enum(['active', 'inactive']).default('active'),
    school_id: z.number().int().positive('School ID must be positive'),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    image: z.string().url('Invalid image URL').optional().nullable(),
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

const getByIdZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'ID must be positive'),
  }),
  query: z.object({
    school_id: z
      .string()
      .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'School ID must be positive')
      .transform(Number),
  }),
});

const idParamZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'ID must be positive'),
  }),
});

export const SignatureValidation = {
  createZodSchema,
  updateZodSchema,
  getAllZodSchema,
  getByIdZodSchema,
  idParamZodSchema,
};
