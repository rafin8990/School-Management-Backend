import { z } from 'zod';

const searchZodSchema = z.object({
  query: z.object({
    school_id: z.string().transform(Number),
    class_id: z.string().transform(Number),
    year_id: z.string().transform(Number),
    class_exam_ids: z.string().optional(),
  }),
});

const upsertZodSchema = z.object({
  body: z.object({
    school_id: z.number().int().positive(),
    class_id: z.number().int().positive(),
    class_exam_ids: z.array(z.number().int().positive()).nonempty(),
    year_id: z.number().int().positive(),
    entries: z.array(z.object({
      subject_id: z.number().int().positive(),
      short_code_id: z.number().int().positive(),
      total_marks: z.number().int().positive(),
      countable_marks: z.number().int().nonnegative(),
      pass_mark: z.number().int().nonnegative(),
      acceptance: z.number().nonnegative(),
      status: z.enum(['active','inactive'])
    })).nonempty(),
  }),
});

export const SetExamMarksValidation = { searchZodSchema, upsertZodSchema };


