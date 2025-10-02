import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { SequentialExamValidation } from './sequentialExam.validation';
import { SequentialExamController } from './sequentialExam.controller';

const router = express.Router();

router.get('/', validateRequest(SequentialExamValidation.listZodSchema), SequentialExamController.listByClassAndExam);
router.post('/', validateRequest(SequentialExamValidation.upsertZodSchema), SequentialExamController.upsert);

export const SequentialExamRoutes = router;


