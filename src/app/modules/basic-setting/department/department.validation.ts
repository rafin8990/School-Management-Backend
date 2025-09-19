import { z } from 'zod';

const createDepartmentZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    serial_number: z.number().int().positive().optional().nullable(),
    school_id: z.number().int().positive(),
    status: z.enum(['active', 'inactive']),
  }),
});

const updateDepartmentZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    serial_number: z.number().int().positive().optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const getAllDepartmentsZodSchema = z.object({
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
    status: z.string().optional(),
    school_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

const getDepartmentByIdZodSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
  }),
});

const deleteDepartmentZodSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
  }),
});

export const DepartmentValidation = {
  createDepartmentZodSchema,
  updateDepartmentZodSchema,
  getAllDepartmentsZodSchema,
  getDepartmentByIdZodSchema,
  deleteDepartmentZodSchema,
};
