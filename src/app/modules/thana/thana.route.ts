import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ThanaController } from './thana.controller';
import { ThanaValidation } from './thana.validation';

const router = Router();

router.post(
  '/',
  validateRequest(ThanaValidation.createThanaZodSchema),
  ThanaController.createThana
);

router.get(
  '/',
  validateRequest(ThanaValidation.getAllThanasZodSchema),
  ThanaController.getAllThanas
);

router.get(
  '/:id',
  validateRequest(ThanaValidation.getSingleThanaZodSchema),
  ThanaController.getSingleThana
);

router.patch(
  '/:id',
  validateRequest(ThanaValidation.updateThanaZodSchema),
  ThanaController.updateThana
);

router.delete(
  '/:id',
  validateRequest(ThanaValidation.deleteThanaZodSchema),
  ThanaController.deleteThana
);

router.get(
  '/district/:districtId',
  validateRequest(ThanaValidation.getThanasByDistrictZodSchema),
  ThanaController.getThanasByDistrict
);

export const ThanaRoutes = router;


