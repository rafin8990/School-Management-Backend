import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { SectionController } from './section.controller';
import { SectionValidation } from './section.validation';

const router = Router();

router.post(
  '/',
  validateRequest(SectionValidation.createSectionZodSchema),
  SectionController.createSection
);

router.get(
  '/',
  validateRequest(SectionValidation.getAllSectionsZodSchema),
  SectionController.getAllSections
);

router.get(
  '/:id',
  validateRequest(SectionValidation.getSingleSectionZodSchema),
  SectionController.getSingleSection
);

router.patch(
  '/:id',
  validateRequest(SectionValidation.updateSectionZodSchema),
  SectionController.updateSection
);

router.delete(
  '/:id',
  validateRequest(SectionValidation.deleteSectionZodSchema),
  SectionController.deleteSection
);

export const SectionRoutes = router;


