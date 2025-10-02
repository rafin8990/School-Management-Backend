import { z } from 'zod';

const generateProgressReportZodSchema = z.object({
  body: z.object({
    class_id: z.number().min(1, 'Class ID is required'),
    exam_id: z.number().min(1, 'Exam ID is required'),
    year_id: z.number().min(1, 'Year ID is required'),
    group_id: z.number().optional(),
    section_id: z.number().optional(),
    shift_id: z.number().optional(),
    student_id: z.number().optional(),
    merit_type: z.enum(['class_wise', 'section_wise'], {
      required_error: 'Merit type is required',
    }),
    school_id: z.number().min(1, 'School ID is required'),
  }),
});

const getStudentsForProgressReportZodSchema = z.object({
  body: z.object({
    class_id: z.number().min(1, 'Class ID is required'),
    exam_id: z.number().min(1, 'Exam ID is required'),
    year_id: z.number().min(1, 'Year ID is required'),
    group_id: z.number().optional(),
    section_id: z.number().optional(),
    shift_id: z.number().optional(),
    merit_type: z.enum(['class_wise', 'section_wise'], {
      required_error: 'Merit type is required',
    }),
    school_id: z.number().min(1, 'School ID is required'),
  }),
});

const getGradeSetupForProgressReportZodSchema = z.object({
  query: z.object({
    class_id: z.string().min(1, 'Class ID is required'),
    exam_id: z.string().min(1, 'Exam ID is required'),
    year_id: z.string().min(1, 'Year ID is required'),
    school_id: z.string().min(1, 'School ID is required'),
  }),
});

const getSequentialExamOrderZodSchema = z.object({
  query: z.object({
    class_id: z.string().min(1, 'Class ID is required'),
    exam_id: z.string().min(1, 'Exam ID is required'),
    school_id: z.string().min(1, 'School ID is required'),
  }),
});

const getProgressReportByIdZodSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Report ID is required'),
  }),
  query: z.object({
    school_id: z.string().min(1, 'School ID is required'),
  }),
});

export const ProgressReportValidation = {
  generateProgressReportZodSchema,
  getStudentsForProgressReportZodSchema,
  getGradeSetupForProgressReportZodSchema,
  getSequentialExamOrderZodSchema,
  getProgressReportByIdZodSchema,
};
