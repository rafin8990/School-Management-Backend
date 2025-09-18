import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ClassController } from './class.controller';
import { ClassValidation } from './class.validation';

const router = Router();

router.post(
  '/',
  validateRequest(ClassValidation.createClassZodSchema),
  ClassController.createClass
);

router.get(
  '/',
  validateRequest(ClassValidation.getAllClassesZodSchema),
  ClassController.getAllClasses
);

router.get(
  '/:id',
  validateRequest(ClassValidation.getSingleClassZodSchema),
  ClassController.getSingleClass
);

router.patch(
  '/:id',
  validateRequest(ClassValidation.updateClassZodSchema),
  ClassController.updateClass
);

router.delete(
  '/:id',
  validateRequest(ClassValidation.deleteClassZodSchema),
  ClassController.deleteClass
);

export const ClassRoutes = router;


