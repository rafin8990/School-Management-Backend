import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DistrictController } from './district.controller';
import { DistrictValidation } from './district.validation';

const router = Router();

router.post(
  '/',
  validateRequest(DistrictValidation.createDistrictZodSchema),
  DistrictController.createDistrict
);

router.get(
  '/',
  validateRequest(DistrictValidation.getAllDistrictsZodSchema),
  DistrictController.getAllDistricts
);

router.get(
  '/:id',
  validateRequest(DistrictValidation.getSingleDistrictZodSchema),
  DistrictController.getSingleDistrict
);

router.patch(
  '/:id',
  validateRequest(DistrictValidation.updateDistrictZodSchema),
  DistrictController.updateDistrict
);

router.delete(
  '/:id',
  validateRequest(DistrictValidation.deleteDistrictZodSchema),
  DistrictController.deleteDistrict
);

export const DistrictRoutes = router;


