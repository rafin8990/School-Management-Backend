import { z } from 'zod';

const assignSubjectsZodSchema = z.object({
  body: z.object({
    school_id: z.number().int().positive(),
    class_id: z.number().int().positive(),
    group_id: z.number().int().positive(),
    assignments: z
      .array(
        z.object({
          subject_id: z.number().int().positive(),
          serial_no: z.number().int().nonnegative(),
          type: z.enum(['choosable', 'uncountable']).optional().nullable(),
          merge_no: z.number().int().nonnegative().optional().nullable(),
        })
      )
      .min(1, 'At least one subject must be selected'),
  }),
});

const getAssignmentsQueryZodSchema = z.object({
  query: z.object({
    school_id: z
      .string()
      .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'School ID must be positive')
      .transform(Number),
    class_id: z
      .string()
      .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Class ID must be positive')
      .transform(Number),
    group_id: z
      .string()
      .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Group ID must be positive')
      .transform(Number),
  }),
});

export const ClassSubjectsValidation = {
  assignSubjectsZodSchema,
  getAssignmentsQueryZodSchema,
};


