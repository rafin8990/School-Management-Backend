import { z } from 'zod';

const generateZodSchema = z.object({
  body: z.object({
    class_id: z.number().optional(),
    group_id: z.number().optional(),
    section_id: z.number().optional(),
    exam_id: z.number(),
    year_id: z.number(),
    school_id: z.number(),
  }),
});

export const SubjectSummaryValidation = { generateZodSchema };


