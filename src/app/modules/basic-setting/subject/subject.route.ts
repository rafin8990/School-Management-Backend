import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { SubjectController } from './subject.controller';
import { SubjectValidation } from './subject.validation';

const router = Router();

router.post(
  '/',
  validateRequest(SubjectValidation.createSubjectZodSchema),
  SubjectController.createSubject
);

router.get(
  '/',
  validateRequest(SubjectValidation.getAllSubjectsZodSchema),
  SubjectController.getAllSubjects
);

router.get(
  '/:id',
  validateRequest(SubjectValidation.getSingleSubjectZodSchema),
  SubjectController.getSingleSubject
);

router.patch(
  '/:id',
  validateRequest(SubjectValidation.updateSubjectZodSchema),
  SubjectController.updateSubject
);

router.delete(
  '/:id',
  validateRequest(SubjectValidation.deleteSubjectZodSchema),
  SubjectController.deleteSubject
);

export const SubjectRoutes = router;


