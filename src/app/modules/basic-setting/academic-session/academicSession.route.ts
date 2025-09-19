import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { AcademicSessionController } from './academicSession.controller';
import { AcademicSessionValidation } from './academicSession.validation';

const router = Router();

router.get(
  '/',
  validateRequest(AcademicSessionValidation.getAllAcademicSessionsZodSchema),
  AcademicSessionController.getAllAcademicSessions
);

router.get(
  '/:id',
  validateRequest(AcademicSessionValidation.getAcademicSessionByIdZodSchema),
  AcademicSessionController.getAcademicSessionById
);

router.post(
  '/',
  validateRequest(AcademicSessionValidation.createAcademicSessionZodSchema),
  AcademicSessionController.createAcademicSession
);

router.patch(
  '/:id',
  validateRequest(AcademicSessionValidation.updateAcademicSessionZodSchema),
  AcademicSessionController.updateAcademicSession
);

router.delete(
  '/:id',
  validateRequest(AcademicSessionValidation.deleteAcademicSessionZodSchema),
  AcademicSessionController.deleteAcademicSession
);

export const AcademicSessionRoutes = router;
