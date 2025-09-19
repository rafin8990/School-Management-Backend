import { z } from 'zod';

const getClassesWithAssignmentsZodSchema = z.object({
  query: z.object({
    school_id: z.string({
      required_error: 'School ID is required',
    }),
  }),
});

const getClassAssignmentsZodSchema = z.object({
  params: z.object({
    classId: z.string({
      required_error: 'Class ID is required',
    }),
  }),
  query: z.object({
    school_id: z.string({
      required_error: 'School ID is required',
    }),
  }),
});

export const ClassAssignmentValidation = {
  getClassesWithAssignmentsZodSchema,
  getClassAssignmentsZodSchema,
};
