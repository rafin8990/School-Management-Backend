import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ClassSubjectsValidation } from './classSubjects.validation';
import { ClassSubjectsController } from './classSubjects.controller';

const router = express.Router();

router.get(
  '/',
  validateRequest(ClassSubjectsValidation.getAssignmentsQueryZodSchema),
  ClassSubjectsController.getAssignments
);

router.post(
  '/',
  validateRequest(ClassSubjectsValidation.assignSubjectsZodSchema),
  ClassSubjectsController.assignSubjects
);

export const ClassSubjectsRoutes = router;


