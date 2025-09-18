import { z } from 'zod';

const createSchoolZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'School name is required' })
      .min(1, 'School name must not be empty')
      .max(255, 'School name must not exceed 255 characters'),
    eiin: z
      .string()
      .max(100, 'EIIN must not exceed 100 characters')
      .optional()
      .nullable(),
    mobile: z
      .string()
      .max(20, 'Mobile must not exceed 20 characters')
      .optional()
      .nullable(),
    logo: z
      .string()
      .max(255, 'Logo URL must not exceed 255 characters')
      .optional()
      .nullable(),
    district_id: z
      .number()
      .int('District ID must be an integer')
      .positive('District ID must be positive'),
    thana_id: z
      .number()
      .int('Thana ID must be an integer')
      .positive('Thana ID must be positive'),
    website: z
      .string()
      .url('Website must be a valid URL')
      .max(255, 'Website URL must not exceed 255 characters')
      .optional()
      .nullable(),
    email: z
      .string()
      .email('Email must be a valid email address')
      .max(255, 'Email must not exceed 255 characters')
      .optional()
      .nullable(),
    address: z
      .string()
      .max(1000, 'Address must not exceed 1000 characters')
      .optional()
      .nullable(),
    payable_amount: z
      .number()
      .positive('Payable amount must be positive')
      .optional()
      .nullable(),
    established_at: z
      .string()
      .max(50, 'Established date must not exceed 50 characters')
      .optional()
      .nullable(),
  }),
});

const updateSchoolZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'School name must not be empty')
      .max(255, 'School name must not exceed 255 characters')
      .optional(),
    eiin: z
      .string()
      .max(100, 'EIIN must not exceed 100 characters')
      .optional()
      .nullable(),
    mobile: z
      .string()
      .max(20, 'Mobile must not exceed 20 characters')
      .optional()
      .nullable(),
    logo: z
      .string()
      .max(255, 'Logo URL must not exceed 255 characters')
      .optional()
      .nullable(),
    district_id: z
      .number()
      .int('District ID must be an integer')
      .positive('District ID must be positive')
      .optional(),
    thana_id: z
      .number()
      .int('Thana ID must be an integer')
      .positive('Thana ID must be positive')
      .optional(),
    website: z
      .string()
      .url('Website must be a valid URL')
      .max(255, 'Website URL must not exceed 255 characters')
      .optional()
      .nullable(),
    email: z
      .string()
      .email('Email must be a valid email address')
      .max(255, 'Email must not exceed 255 characters')
      .optional()
      .nullable(),
    address: z
      .string()
      .max(1000, 'Address must not exceed 1000 characters')
      .optional()
      .nullable(),
    payable_amount: z
      .number()
      .positive('Payable amount must be positive')
      .optional()
      .nullable(),
    established_at: z
      .string()
      .max(50, 'Established date must not exceed 50 characters')
      .optional()
      .nullable(),
  }),
});

const getSingleSchoolZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'School ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'School ID must be a positive number',
      }),
  }),
});

const deleteSchoolZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'School ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'School ID must be a positive number',
      }),
  }),
});

const getAllSchoolsZodSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    eiin: z.string().optional(),
    district_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'District ID must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    thana_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Thana ID must be a positive number',
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

const getSchoolsByDistrictZodSchema = z.object({
  params: z.object({
    districtId: z
      .string({ required_error: 'District ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'District ID must be a positive number',
      }),
  }),
});

const getSchoolsByThanaZodSchema = z.object({
  params: z.object({
    thanaId: z
      .string({ required_error: 'Thana ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Thana ID must be a positive number',
      }),
  }),
});

export const SchoolValidation = {
  createSchoolZodSchema,
  updateSchoolZodSchema,
  getSingleSchoolZodSchema,
  deleteSchoolZodSchema,
  getAllSchoolsZodSchema,
  getSchoolsByDistrictZodSchema,
  getSchoolsByThanaZodSchema,
};
