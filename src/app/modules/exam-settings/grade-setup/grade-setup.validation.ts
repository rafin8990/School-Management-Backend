import { z } from 'zod';

const createZodSchema = z.object({
  body: z.object({
    exam_id: z.number().int().positive('Exam ID must be positive'),
    year_id: z.number().int().positive('Year ID must be positive').optional().nullable(),
    class_id: z.number().int().positive('Class ID must be positive'),
    school_id: z.number().int().positive('School ID must be positive'),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    exam_id: z.number().int().positive('Exam ID must be positive').optional(),
    year_id: z.number().int().positive('Year ID must be positive').optional().nullable(),
    class_id: z.number().int().positive('Class ID must be positive').optional(),
  }),
});

const getByExamAndYearZodSchema = z.object({
  query: z.object({
    exam_id: z
      .string()
      .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Exam ID must be positive')
      .transform(Number),
    year_id: z
      .string()
      .refine(v => v === '' || (!isNaN(Number(v)) && Number(v) > 0), 'Year ID must be positive')
      .transform(v => v === '' ? null : Number(v))
      .optional(),
    school_id: z
      .string()
      .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'School ID must be positive')
      .transform(Number),
  }),
});

const getByIdZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'ID must be positive'),
  }),
  query: z.object({
    school_id: z
      .string()
      .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'School ID must be positive')
      .transform(Number),
  }),
});

const idParamZodSchema = z.object({
  params: z.object({
    id: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'ID must be positive'),
  }),
});

const upsertGradeSetupZodSchema = z.object({
  body: z.object({
    exam_id: z.number().int().positive('Exam ID must be positive'),
    year_id: z.number().int().positive('Year ID must be positive').optional().nullable(),
    class_ids: z.array(z.number().int().positive('Class ID must be positive')).min(1, 'At least one class must be selected'),
    school_id: z.number().int().positive('School ID must be positive'),
  }),
});

// Grade Point Setup validations
const createGradePointZodSchema = z.object({
  body: z.object({
    grade_setup_id: z.number().int().positive('Grade setup ID must be positive'),
    mark_point_first: z.number().int().min(0, 'First mark point must be non-negative'),
    mark_point_second: z.number().int().min(0, 'Second mark point must be non-negative'),
    grade_point: z.number().min(0).max(5).optional().nullable(),
    letter_grade: z.string().max(10, 'Letter grade must be 10 characters or less').optional().nullable(),
    note: z.string().optional().nullable(),
    status: z.enum(['active', 'inactive']).default('active'),
  }),
});

const updateGradePointZodSchema = z.object({
  body: z.object({
    mark_point_first: z.number().int().min(0, 'First mark point must be non-negative').optional(),
    mark_point_second: z.number().int().min(0, 'Second mark point must be non-negative').optional(),
    grade_point: z.number().min(0).max(5).optional().nullable(),
    letter_grade: z.string().max(10, 'Letter grade must be 10 characters or less').optional().nullable(),
    note: z.string().optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const getGradePointsBySetupIdZodSchema = z.object({
  params: z.object({
    gradeSetupId: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Grade setup ID must be positive'),
  }),
});

const bulkUpsertGradePointsZodSchema = z.object({
  body: z.object({
    grade_setup_id: z.number().int().positive('Grade setup ID must be positive'),
    grade_points: z.array(
      z.object({
        mark_point_first: z.number().int().min(0, 'First mark point must be non-negative'),
        mark_point_second: z.number().int().min(0, 'Second mark point must be non-negative'),
        grade_point: z.number().min(0).max(5).optional().nullable(),
        letter_grade: z.string().max(10, 'Letter grade must be 10 characters or less').optional().nullable(),
        note: z.string().optional().nullable(),
        status: z.enum(['active', 'inactive']).default('active'),
      })
    ),
  }),
});

export const GradeSetupValidation = {
  createZodSchema,
  updateZodSchema,
  getByExamAndYearZodSchema,
  getByIdZodSchema,
  idParamZodSchema,
  upsertGradeSetupZodSchema,
  createGradePointZodSchema,
  updateGradePointZodSchema,
  getGradePointsBySetupIdZodSchema,
  bulkUpsertGradePointsZodSchema,
};
