import { z } from 'zod';

const upsertZodSchema = z.object({
  body: z.object({
    exam_id: z.number().int().positive(),
    year_id: z.number().int().positive(),
    publish_status: z.enum(['publish','editable']).default('editable'),
    school_id: z.number().int().positive(),
  }),
});

const getZodSchema = z.object({
  query: z.object({
    school_id: z.string().refine(v=>!isNaN(Number(v)) && Number(v)>0,'School ID must be positive').transform(Number),
    exam_id: z.string().refine(v=>!isNaN(Number(v)) && Number(v)>0,'Exam ID must be positive').transform(Number),
    year_id: z.string().refine(v=>!isNaN(Number(v)) && Number(v)>0,'Year ID must be positive').transform(Number),
  })
});

export const ExamPublishValidation = { upsertZodSchema, getZodSchema };


