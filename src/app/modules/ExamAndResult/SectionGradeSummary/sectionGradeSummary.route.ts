import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { SectionGradeSummaryValidation } from './sectionGradeSummary.validation';
import { SectionGradeSummaryController } from './sectionGradeSummary.controller';

const router = express.Router();

router.post('/', validateRequest(SectionGradeSummaryValidation.generateZodSchema), SectionGradeSummaryController.generate);

export const SectionGradeSummaryRoutes = router;


