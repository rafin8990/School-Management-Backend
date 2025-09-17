import { z } from 'zod';

const createThanaZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name must not be empty')
      .max(120, 'Name must not exceed 120 characters'),
    district_id: z
      .number()
      .int('District ID must be an integer')
      .positive('District ID must be positive')
      .optional()
      .nullable(),
  }),
});

const updateThanaZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name must not be empty')
      .max(120, 'Name must not exceed 120 characters')
      .optional(),
    district_id: z
      .number()
      .int('District ID must be an integer')
      .positive('District ID must be positive')
      .optional()
      .nullable(),
  }),
});

const getSingleThanaZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Thana ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Thana ID must be a positive number',
      }),
  }),
});

const deleteThanaZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Thana ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Thana ID must be a positive number',
      }),
  }),
});

const getAllThanasZodSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    district_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'District ID must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
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

const getThanasByDistrictZodSchema = z.object({
  params: z.object({
    districtId: z
      .string({ required_error: 'District ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'District ID must be a positive number',
      }),
  }),
});

export const ThanaValidation = {
  createThanaZodSchema,
  updateThanaZodSchema,
  getSingleThanaZodSchema,
  deleteThanaZodSchema,
  getAllThanasZodSchema,
  getThanasByDistrictZodSchema,
};


