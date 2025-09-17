import { z } from 'zod';

const createDistrictZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name must not be empty')
      .max(120, 'Name must not exceed 120 characters'),
  }),
});

const updateDistrictZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name must not be empty')
      .max(120, 'Name must not exceed 120 characters')
      .optional(),
  }),
});

const getSingleDistrictZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'District ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'District ID must be a positive number',
      }),
  }),
});

const deleteDistrictZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'District ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'District ID must be a positive number',
      }),
  }),
});

const getAllDistrictsZodSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    page: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Page must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    limit: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Limit must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const DistrictValidation = {
  createDistrictZodSchema,
  updateDistrictZodSchema,
  getSingleDistrictZodSchema,
  deleteDistrictZodSchema,
  getAllDistrictsZodSchema,
};


