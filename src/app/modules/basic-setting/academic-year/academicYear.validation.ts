import { z } from 'zod';

const createAcademicYearZodSchema = z.object({
  body: z.object({
    name: z.number().int().positive(),
    serial_number: z.number().int().positive().optional().nullable(),
    school_id: z.number().int().positive(),
    status: z.enum(['active', 'inactive']),
  }),
});

const updateAcademicYearZodSchema = z.object({
  body: z.object({
    name: z.number().int().positive().optional(),
    serial_number: z.number().int().positive().optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const getAllAcademicYearsZodSchema = z.object({
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
    name: z
      .string()
      .optional()
      .refine(val => !val || !isNaN(Number(val)))
      .transform(val => val ? Number(val) : undefined),
    status: z.string().optional(),
    school_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

const getAcademicYearByIdZodSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
  }),
});

const deleteAcademicYearZodSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0)
      .transform(val => Number(val)),
  }),
});

export const AcademicYearValidation = {
  createAcademicYearZodSchema,
  updateAcademicYearZodSchema,
  getAllAcademicYearsZodSchema,
  getAcademicYearByIdZodSchema,
  deleteAcademicYearZodSchema,
};
