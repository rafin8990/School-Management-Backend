import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    usernameOrMobile: z
      .string({ required_error: 'Username or mobile is required' })
      .min(1, 'Username or mobile cannot be empty'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'),
  }),
});

const registerZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name cannot be empty')
      .max(100, 'Name must not exceed 100 characters'),
    email: z
      .string()
      .email('Invalid email format')
      .optional()
      .nullable(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    username: z
      .string({ required_error: 'Username is required' })
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters'),
    mobile_no: z
      .string({ required_error: 'Mobile number is required' })
      .min(11, 'Mobile number must be at least 11 digits')
      .max(15, 'Mobile number must not exceed 15 digits'),
    photo: z
      .string()
      .optional()
      .nullable(),
    school_id: z
      .number({ required_error: 'School ID is required' })
      .int('School ID must be an integer')
      .positive('School ID must be positive'),
    address: z
      .string()
      .optional()
      .nullable(),
    role: z
      .string()
      .optional()
      .default('school_admin'),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  registerZodSchema,
};
