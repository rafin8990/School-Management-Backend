import { z } from 'zod';

const createBoardExamZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    serial_number: z.number().int().positive().optional().nullable(),
    school_id: z.number().int().positive(),
  }),
});

const updateBoardExamZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    serial_number: z.number().int().positive().optional().nullable(),
  }),
});

const getAllBoardExamsZodSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .refine(val => !val || (!isNaN(Number(val)) && Number(val) > 0))
      .transform(val => val ? Number(val) : undefined),
    limit: z
      .string()
      .optional()
      .refine(val => !val || (!isNaN(Number(val)) && Number(val) > 0))
      .transform(val => val ? Number(val) : undefined),
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    school_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

const getBoardExamByIdZodSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
  }),
});

const deleteBoardExamZodSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
  }),
});

export const BoardExamValidation = {
  createBoardExamZodSchema,
  updateBoardExamZodSchema,
  getAllBoardExamsZodSchema,
  getBoardExamByIdZodSchema,
  deleteBoardExamZodSchema,
};
