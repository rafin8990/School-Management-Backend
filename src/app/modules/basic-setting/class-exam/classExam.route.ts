import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ClassExamController } from './classExam.controller';
import { ClassExamValidation } from './classExam.validation';

const router = Router();

router.post(
  '/',
  validateRequest(ClassExamValidation.createClassExamZodSchema),
  ClassExamController.createClassExam
);

router.get(
  '/',
  validateRequest(ClassExamValidation.getAllClassExamsZodSchema),
  ClassExamController.getAllClassExams
);

router.get(
  '/:id',
  validateRequest(ClassExamValidation.getSingleClassExamZodSchema),
  ClassExamController.getSingleClassExam
);

router.patch(
  '/:id',
  validateRequest(ClassExamValidation.updateClassExamZodSchema),
  ClassExamController.updateClassExam
);

router.delete(
  '/:id',
  validateRequest(ClassExamValidation.deleteClassExamZodSchema),
  ClassExamController.deleteClassExam
);

export const ClassExamRoutes = router;


