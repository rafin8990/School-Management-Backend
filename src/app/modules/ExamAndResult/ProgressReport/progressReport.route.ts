import express from 'express';
import { ProgressReportController } from './progressReport.controller';
import { ProgressReportValidation } from './progressReport.validation';
import validateRequest from '../../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/generate',
  validateRequest(ProgressReportValidation.generateProgressReportZodSchema),
  ProgressReportController.generateProgressReport
);

router.post(
  '/students',
  validateRequest(ProgressReportValidation.getStudentsForProgressReportZodSchema),
  ProgressReportController.getStudentsForProgressReport
);

router.get(
  '/grade-setup',
  validateRequest(ProgressReportValidation.getGradeSetupForProgressReportZodSchema),
  ProgressReportController.getGradeSetupForProgressReport
);

router.get(
  '/sequential-exam',
  validateRequest(ProgressReportValidation.getSequentialExamOrderZodSchema),
  ProgressReportController.getSequentialExamOrder
);

router.get(
  '/:id',
  validateRequest(ProgressReportValidation.getProgressReportByIdZodSchema),
  ProgressReportController.getProgressReportById
);

export const ProgressReportRoutes = router;
