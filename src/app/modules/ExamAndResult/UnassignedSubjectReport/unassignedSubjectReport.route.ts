import express from 'express';
import { UnassignedSubjectReportController } from './unassignedSubjectReport.controller';
import { UnassignedSubjectReportValidation } from './unassignedSubjectReport.validation';
import validateRequest from '../../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/',
  validateRequest(UnassignedSubjectReportValidation.generateUnassignedSubjectReportZodSchema),
  UnassignedSubjectReportController.generateUnassignedSubjectReport
);

export const UnassignedSubjectReportRoutes = router;
