import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { SubjectSummaryValidation } from './subjectSummary.validation';
import { SubjectSummaryController } from './subjectSummary.controller';

const router = express.Router();

router.post('/', validateRequest(SubjectSummaryValidation.generateZodSchema), SubjectSummaryController.generate);

export const SubjectSummaryRoutes = router;


