import { z } from 'zod';

const createZodSchema = z.object({
  body: z.object({
    mark_point_first: z.number().int().min(0, 'First mark point must be non-negative'),
    mark_point_second: z.number().int().min(0, 'Second mark point must be non-negative'),
    grade_point: z.number().min(0).max(5).optional().nullable(),
    letter_grade: z.string().max(10, 'Letter grade must be 10 characters or less').optional().nullable(),
    note: z.string().optional().nullable(),
    status: z.enum(['active', 'inactive']).default('active'),
    school_id: z.number().int().positive('School ID must be positive'),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    mark_point_first: z.number().int().min(0, 'First mark point must be non-negative').optional(),
    mark_point_second: z.number().int().min(0, 'Second mark point must be non-negative').optional(),
    grade_point: z.number().min(0).max(5).optional().nullable(),
    letter_grade: z.string().max(10, 'Letter grade must be 10 characters or less').optional().nullable(),
    note: z.string().optional().nullable(),
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

const bulkCreateZodSchema = z.object({
  body: z.array(createZodSchema.shape.body),
});

const bulkUpdateZodSchema = z.object({
  body: z.array(
    z.object({
      id: z.number().int().positive('ID must be positive'),
      mark_point_first: z.number().int().min(0).optional(),
      mark_point_second: z.number().int().min(0).optional(),
      grade_point: z.number().min(0).max(5).optional().nullable(),
      letter_grade: z.string().max(10).optional().nullable(),
      note: z.string().optional().nullable(),
      status: z.enum(['active', 'inactive']).optional(),
    })
  ),
});

export const GradeValidation = {
  createZodSchema,
  updateZodSchema,
  getAllZodSchema,
  getByIdZodSchema,
  idParamZodSchema,
  bulkCreateZodSchema,
  bulkUpdateZodSchema,
};
