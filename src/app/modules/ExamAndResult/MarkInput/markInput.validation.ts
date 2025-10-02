import { z } from 'zod';

const createMarkInputZodSchema = z.object({
  body: z.object({
    student_id: z.number({
      required_error: 'Student ID is required',
    }),
    class_id: z.number({
      required_error: 'Class ID is required',
    }),
    group_id: z.number().optional(),
    section_id: z.number().optional(),
    shift_id: z.number().optional(),
    subject_id: z.number({
      required_error: 'Subject ID is required',
    }),
    exam_id: z.number({
      required_error: 'Exam ID is required',
    }),
    year_id: z.number({
      required_error: 'Year ID is required',
    }),
    full_mark: z.number().optional(),
    total_mark: z.number().optional(),
    grade: z.string().optional(),
    gpa: z.number().optional(),
    status: z.enum(['absent', 'present'], {
      required_error: 'Status is required',
    }),
    short_code_marks: z.record(z.string(), z.number(), {
      required_error: 'Short code marks is required',
    }),
    school_id: z.number({
      required_error: 'School ID is required',
    }),
  }),
});

const updateMarkInputZodSchema = z.object({
  body: z.object({
    student_id: z.number().optional(),
    class_id: z.number().optional(),
    group_id: z.number().optional(),
    section_id: z.number().optional(),
    shift_id: z.number().optional(),
    subject_id: z.number().optional(),
    exam_id: z.number().optional(),
    year_id: z.number().optional(),
    full_mark: z.number().optional(),
    total_mark: z.number().optional(),
    grade: z.string().optional(),
    gpa: z.number().optional(),
    status: z.enum(['absent', 'present']).optional(),
    short_code_marks: z.record(z.string(), z.number()).optional(),
    school_id: z.number().optional(),
  }),
});

const searchStudentsZodSchema = z.object({
  body: z.object({
    class_id: z.number({
      required_error: 'Class ID is required',
    }),
    subject_id: z.number({
      required_error: 'Subject ID is required',
    }),
    exam_id: z.number({
      required_error: 'Exam ID is required',
    }),
    year_id: z.number({
      required_error: 'Year ID is required',
    }),
    group_id: z.number().optional(),
    section_id: z.number().optional(),
    shift_id: z.number().optional(),
    category_id: z.number().optional(),
    school_id: z.number({
      required_error: 'School ID is required',
    }),
  }),
});

const saveMarkInputZodSchema = z.object({
  body: z.object({
    class_id: z.number({
      required_error: 'Class ID is required',
    }),
    subject_id: z.number({
      required_error: 'Subject ID is required',
    }),
    exam_id: z.number({
      required_error: 'Exam ID is required',
    }),
    year_id: z.number({
      required_error: 'Year ID is required',
    }),
    school_id: z.number({
      required_error: 'School ID is required',
    }),
    marks_data: z.array(
      z.object({
        student_id: z.number({
          required_error: 'Student ID is required',
        }),
        group_id: z.number().optional(),
        section_id: z.number().optional(),
        shift_id: z.number().optional(),
        full_mark: z.number({
          required_error: 'Full mark is required',
        }),
        short_code_marks: z.record(z.string(), z.number(), {
          required_error: 'Short code marks is required',
        }),
        status: z.enum(['absent', 'present'], {
          required_error: 'Status is required',
        }),
      })
    ),
  }),
});

const bulkUploadMarkInputZodSchema = z.object({
  body: z.object({
    class_id: z.number({
      required_error: 'Class ID is required',
    }),
    subject_id: z.number({
      required_error: 'Subject ID is required',
    }),
    exam_id: z.number({
      required_error: 'Exam ID is required',
    }),
    year_id: z.number({
      required_error: 'Year ID is required',
    }),
    school_id: z.number({
      required_error: 'School ID is required',
    }),
    marks_data: z.array(
      z.object({
        student_id: z.number({
          required_error: 'Student ID is required',
        }),
        group_id: z.number().optional(),
        section_id: z.number().optional(),
        shift_id: z.number().optional(),
        full_mark: z.number({
          required_error: 'Full mark is required',
        }),
        short_code_marks: z.record(z.string(), z.number(), {
          required_error: 'Short code marks is required',
        }),
        status: z.enum(['absent', 'present'], {
          required_error: 'Status is required',
        }),
      })
    ),
  }),
});

const deleteBySubjectWiseZodSchema = z.object({
  body: z.object({
    class_id: z.number({
      required_error: 'Class ID is required',
    }),
    subject_id: z.number({
      required_error: 'Subject ID is required',
    }),
    exam_id: z.number({
      required_error: 'Exam ID is required',
    }),
    year_id: z.number({
      required_error: 'Year ID is required',
    }),
    school_id: z.number({
      required_error: 'School ID is required',
    }),
    group_id: z.number().optional(),
    section_id: z.number().optional(),
    shift_id: z.number().optional(),
  }),
});

export const MarkInputValidation = {
  createMarkInputZodSchema,
  updateMarkInputZodSchema,
  searchStudentsZodSchema,
  saveMarkInputZodSchema,
  bulkUploadMarkInputZodSchema,
  deleteBySubjectWiseZodSchema,
};
