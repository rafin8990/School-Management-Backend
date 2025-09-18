import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SchoolController } from './school.controller';
import { SchoolValidation } from './school.validation';

const router = Router();

router.post(
  '/',
  validateRequest(SchoolValidation.createSchoolZodSchema),
  SchoolController.createSchool
);

router.get(
  '/',
  validateRequest(SchoolValidation.getAllSchoolsZodSchema),
  SchoolController.getAllSchools
);

router.get(
  '/:id',
  validateRequest(SchoolValidation.getSingleSchoolZodSchema),
  SchoolController.getSingleSchool
);

router.patch(
  '/:id',
  validateRequest(SchoolValidation.updateSchoolZodSchema),
  SchoolController.updateSchool
);

router.delete(
  '/:id',
  validateRequest(SchoolValidation.deleteSchoolZodSchema),
  SchoolController.deleteSchool
);

router.get(
  '/district/:districtId',
  validateRequest(SchoolValidation.getSchoolsByDistrictZodSchema),
  SchoolController.getSchoolsByDistrict
);

router.get(
  '/thana/:thanaId',
  validateRequest(SchoolValidation.getSchoolsByThanaZodSchema),
  SchoolController.getSchoolsByThana
);

export const SchoolRoutes = router;
