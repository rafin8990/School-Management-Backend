import { z } from 'zod';

const createTransferCertificateValidationSchema = z.object({
  body: z.object({
    school_id: z.coerce.number({
      required_error: 'School ID is required',
    }),
    class_id: z.coerce.number({
      required_error: 'Class ID is required',
    }),
    student_id: z.coerce.number({
      required_error: 'Student ID is required',
    }),
    exam_name: z.string().optional(),
    appeared_exam: z.string().optional(),
    appeared_year: z.coerce.number({
      required_error: 'Appeared year is required',
    }),
    last_payment_month: z.string().optional(),
    promoted_class: z.string().optional(),
    detained_class: z.string().optional(),
    reason_for_leave: z.string().optional(),
    created_by: z.coerce.number().optional(),
  }),
});

const updateTransferCertificateValidationSchema = z.object({
  body: z.object({
    school_id: z.coerce.number().optional(),
    class_id: z.coerce.number().optional(),
    student_id: z.coerce.number().optional(),
    exam_name: z.string().optional(),
    appeared_exam: z.string().optional(),
    appeared_year: z.coerce.number().optional(),
    last_payment_month: z.string().optional(),
    promoted_class: z.string().optional(),
    detained_class: z.string().optional(),
    reason_for_leave: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
    updated_by: z.coerce.number().optional(),
  }),
});

const transferCertificateValidationSchema = z.object({
  school_id: z.coerce.number({
    required_error: 'School ID is required',
  }),
  class_id: z.coerce.number({
    required_error: 'Class ID is required',
  }),
  student_id: z.coerce.number({
    required_error: 'Student ID is required',
  }),
  exam_name: z.string().optional(),
  appeared_exam: z.string().optional(),
  appeared_year: z.coerce.number({
    required_error: 'Appeared year is required',
  }),
  last_payment_month: z.string().optional(),
  promoted_class: z.string().optional(),
  detained_class: z.string().optional(),
  reason_for_leave: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
  created_by: z.coerce.number().optional(),
  updated_by: z.coerce.number().optional(),
});

const transferCertificateQueryValidationSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    school_id: z.coerce.number().optional(),
    class_id: z.coerce.number().optional(),
    student_id: z.coerce.number().optional(),
    appeared_year: z.coerce.number().optional(),
    status: z.string().optional(),
    created_by: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

const transferCertificateParamsValidationSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      required_error: 'Transfer certificate ID is required',
    }),
  }),
});

export {
  createTransferCertificateValidationSchema,
  updateTransferCertificateValidationSchema,
  transferCertificateValidationSchema,
  transferCertificateQueryValidationSchema,
  transferCertificateParamsValidationSchema,
};
