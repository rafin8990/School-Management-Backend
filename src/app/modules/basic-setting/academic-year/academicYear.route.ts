import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { AcademicYearController } from './academicYear.controller';
import { AcademicYearValidation } from './academicYear.validation';

const router = Router();

router.get(
  '/',
  validateRequest(AcademicYearValidation.getAllAcademicYearsZodSchema),
  AcademicYearController.getAllAcademicYears
);

router.get(
  '/:id',
  validateRequest(AcademicYearValidation.getAcademicYearByIdZodSchema),
  AcademicYearController.getAcademicYearById
);

router.post(
  '/',
  validateRequest(AcademicYearValidation.createAcademicYearZodSchema),
  AcademicYearController.createAcademicYear
);

router.patch(
  '/:id',
  validateRequest(AcademicYearValidation.updateAcademicYearZodSchema),
  AcademicYearController.updateAcademicYear
);

router.delete(
  '/:id',
  validateRequest(AcademicYearValidation.deleteAcademicYearZodSchema),
  AcademicYearController.deleteAcademicYear
);

export const AcademicYearRoutes = router;
