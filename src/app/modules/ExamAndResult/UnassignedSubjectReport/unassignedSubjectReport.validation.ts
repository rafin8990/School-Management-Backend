import { z } from 'zod';

const generateUnassignedSubjectReportZodSchema = z.object({
  body: z.object({
    class_id: z.number().optional(),
    group_id: z.number().optional(),
    section_id: z.number().optional(),
    shift_id: z.number().optional(),
    exam_id: z.number({
      required_error: 'Exam ID is required',
    }),
    year_id: z.number({
      required_error: 'Year ID is required',
    }),
    school_id: z.number({
      required_error: 'School ID is required',
    }),
  }),
});

export const UnassignedSubjectReportValidation = {
  generateUnassignedSubjectReportZodSchema,
};
