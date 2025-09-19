import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ClassAssignmentController } from './class-assignment.controller';
import { ClassAssignmentValidation } from './class-assignment.validation';

const router = Router();

router.get(
  '/classes-with-assignments',
  validateRequest(ClassAssignmentValidation.getClassesWithAssignmentsZodSchema),
  ClassAssignmentController.getClassesWithAssignments
);

router.get(
  '/class-assignments/:classId',
  validateRequest(ClassAssignmentValidation.getClassAssignmentsZodSchema),
  ClassAssignmentController.getClassAssignments
);

export const ClassAssignmentRoutes = router;
