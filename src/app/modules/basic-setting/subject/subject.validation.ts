import { z } from 'zod';

const createSubjectZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Subject name is required' })
      .min(1, 'Subject name must not be empty')
      .max(255, 'Subject name must not exceed 255 characters'),
    code: z.string().max(100).optional().nullable(),
    serial_number: z.number().int().optional().nullable(),
    status: z.enum(['active', 'inactive'], { required_error: 'Status is required' }),
    school_id: z.number().int().positive(),
  }),
});

const updateSubjectZodSchema = z.object({
  body: z.object({
    name: z.string().max(255).optional(),
    code: z.string().max(100).optional().nullable(),
    serial_number: z.number().int().optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const getSingleSubjectZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Subject ID must be positive'),
  }),
});

const deleteSubjectZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Subject ID must be positive'),
  }),
});

const getAllSubjectsZodSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    school_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, { message: 'School ID must be positive' })
      .transform(val => Number(val))
      .optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const SubjectValidation = {
  createSubjectZodSchema,
  updateSubjectZodSchema,
  getSingleSubjectZodSchema,
  deleteSubjectZodSchema,
  getAllSubjectsZodSchema,
};


