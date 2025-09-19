import { z } from 'zod';

const createClassPeriodZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    serial_number: z.number().int().positive().optional().nullable(),
    school_id: z.number().int().positive('School ID must be a positive integer'),
    status: z.enum(['active', 'inactive'], {
      required_error: 'Status is required',
      invalid_type_error: 'Status must be either active or inactive',
    }),
  }),
});

const updateClassPeriodZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
    serial_number: z.number().int().positive().optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const getAllClassPeriodsZodSchema = z.object({
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

const getClassPeriodByIdZodSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
  }),
});

const deleteClassPeriodZodSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
  }),
});

export const ClassPeriodValidation = {
  createClassPeriodZodSchema,
  updateClassPeriodZodSchema,
  getAllClassPeriodsZodSchema,
  getClassPeriodByIdZodSchema,
  deleteClassPeriodZodSchema,
};
