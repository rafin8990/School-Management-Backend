import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ClassGroupController } from './classGroup.controller';
import { ClassGroupValidation } from './classGroup.validation';

const router = Router();

router.get(
  '/',
  validateRequest(ClassGroupValidation.getByClassZodSchema),
  ClassGroupController.getByClass
);

router.post(
  '/',
  validateRequest(ClassGroupValidation.upsertClassGroupZodSchema),
  ClassGroupController.upsert
);

export const ClassGroupRoutes = router;


