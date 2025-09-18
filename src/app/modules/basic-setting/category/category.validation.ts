import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Category name is required' }).min(1).max(255),
    serial_number: z.number().int().optional().nullable(),
    status: z.enum(['active', 'inactive'], { required_error: 'Status is required' }),
    school_id: z.number().int().positive(),
  }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().max(255).optional(),
    serial_number: z.number().int().optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const getSingleCategoryZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Category ID must be positive'),
  }),
});

const deleteCategoryZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Category ID must be positive'),
  }),
});

const getAllCategoriesZodSchema = z.object({
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

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
  getSingleCategoryZodSchema,
  deleteCategoryZodSchema,
  getAllCategoriesZodSchema,
};


