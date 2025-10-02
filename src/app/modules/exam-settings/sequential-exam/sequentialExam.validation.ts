import { z } from 'zod';

const listZodSchema = z.object({
  query: z.object({
    school_id: z.string().refine(v=>!isNaN(Number(v)) && Number(v)>0,'School ID must be positive').transform(Number),
    class_id: z.string().refine(v=>!isNaN(Number(v)) && Number(v)>0,'Class ID must be positive').transform(Number),
    exam_id: z.string().refine(v=>!isNaN(Number(v)) && Number(v)>0,'Exam ID must be positive').transform(Number),
  })
});

const upsertZodSchema = z.object({
  body: z.object({
    class_id: z.number().int().positive(),
    exam_id: z.number().int().positive(),
    sequence: z.enum(['Grade_TotalMark_Roll','TotalMark_Grade_Roll','TotalMark_Roll_Grade','Roll_TotalMark_Grade']),
    school_id: z.number().int().positive(),
  })
});

export const SequentialExamValidation = { listZodSchema, upsertZodSchema };


