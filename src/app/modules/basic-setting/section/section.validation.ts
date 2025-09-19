import { z } from 'zod';

const createSectionZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Section name is required',
    }),
    serial_number: z.number().optional(),
    status: z.enum(['active', 'inactive'], {
      required_error: 'Status is required',
    }),
    school_id: z.number({
      required_error: 'School ID is required',
    }),
  }),
});

const updateSectionZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    serial_number: z.number().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    school_id: z.number().optional(),
  }),
});

const getSingleSectionZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Section ID is required',
    }),
  }),
});

const deleteSectionZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Section ID is required',
    }),
  }),
});

const getAllSectionsZodSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    school_id: z.string().optional(),
  }),
});

export const SectionValidation = {
  createSectionZodSchema,
  updateSectionZodSchema,
  getSingleSectionZodSchema,
  deleteSectionZodSchema,
  getAllSectionsZodSchema,
};