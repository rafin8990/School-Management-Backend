import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ExamPublishValidation } from './examPublish.validation';
import { ExamPublishController } from './examPublish.controller';

const router = express.Router();

router.get('/', validateRequest(ExamPublishValidation.getZodSchema), ExamPublishController.get);
router.post('/', validateRequest(ExamPublishValidation.upsertZodSchema), ExamPublishController.upsert);

export const ExamPublishRoutes = router;


