import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ClassSectionController } from './classSection.controller';
import { ClassSectionValidation } from './classSection.validation';

const router = Router();

router.get(
  '/',
  validateRequest(ClassSectionValidation.getByClassZodSchema),
  ClassSectionController.getByClass
);

router.post(
  '/',
  validateRequest(ClassSectionValidation.upsertClassSectionZodSchema),
  ClassSectionController.upsert
);

export const ClassSectionRoutes = router;
