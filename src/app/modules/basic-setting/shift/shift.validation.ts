import { z } from 'zod';

const createShiftZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Shift name is required' })
      .min(1, 'Shift name must not be empty')
      .max(255, 'Shift name must not exceed 255 characters'),
    serial_number: z
      .number()
      .int('Serial number must be an integer')
      .optional()
      .nullable(),
    status: z.enum(['active', 'inactive'], {
      required_error: 'Status is required',
    }),
    school_id: z
      .number({ required_error: 'School ID is required' })
      .int('School ID must be an integer')
      .positive('School ID must be positive'),
  }),
});

const updateShiftZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Shift name must not be empty')
      .max(255, 'Shift name must not exceed 255 characters')
      .optional(),
    serial_number: z
      .number()
      .int('Serial number must be an integer')
      .nullable()
      .optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const getSingleShiftZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Shift ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Shift ID must be a positive number',
      }),
  }),
});

const deleteShiftZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Shift ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Shift ID must be a positive number',
      }),
  }),
});

const getAllShiftsZodSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    school_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'School ID must be a positive number',
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

export const ShiftValidation = {
  createShiftZodSchema,
  updateShiftZodSchema,
  getSingleShiftZodSchema,
  deleteShiftZodSchema,
  getAllShiftsZodSchema,
};


