import { z } from 'zod';

const createClassExamZodSchema = z.object({
  body: z.object({
    class_exam_name: z.string({ required_error: 'Class exam name is required' }).min(1).max(255),
    position: z.number().int('Position must be an integer'),
    serial_number: z.number().int().optional().nullable(),
    status: z.enum(['active', 'inactive'], { required_error: 'Status is required' }),
    school_id: z.number().int().positive(),
  }),
});

const updateClassExamZodSchema = z.object({
  body: z.object({
    class_exam_name: z.string().max(255).optional(),
    position: z.number().int().optional(),
    serial_number: z.number().int().optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const getSingleClassExamZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'ID must be positive'),
  }),
});

const deleteClassExamZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'ID must be positive'),
  }),
});

const getAllClassExamsZodSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    class_exam_name: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    school_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val))
      .optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const ClassExamValidation = {
  createClassExamZodSchema,
  updateClassExamZodSchema,
  getSingleClassExamZodSchema,
  deleteClassExamZodSchema,
  getAllClassExamsZodSchema,
};


