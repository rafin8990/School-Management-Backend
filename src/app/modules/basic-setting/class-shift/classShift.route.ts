import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ClassShiftController } from './classShift.controller';
import { ClassShiftValidation } from './classShift.validation';

const router = Router();

router.get(
  '/',
  validateRequest(ClassShiftValidation.getByClassZodSchema),
  ClassShiftController.getByClass
);

router.post(
  '/',
  validateRequest(ClassShiftValidation.upsertClassShiftZodSchema),
  ClassShiftController.upsert
);

export const ClassShiftRoutes = router;
