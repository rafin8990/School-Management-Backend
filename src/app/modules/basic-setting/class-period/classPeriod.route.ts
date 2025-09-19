import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ClassPeriodController } from './classPeriod.controller';
import { ClassPeriodValidation } from './classPeriod.validation';

const router = Router();

router.get(
  '/',
  validateRequest(ClassPeriodValidation.getAllClassPeriodsZodSchema),
  ClassPeriodController.getAllClassPeriods
);

router.get(
  '/:id',
  validateRequest(ClassPeriodValidation.getClassPeriodByIdZodSchema),
  ClassPeriodController.getClassPeriodById
);

router.post(
  '/',
  validateRequest(ClassPeriodValidation.createClassPeriodZodSchema),
  ClassPeriodController.createClassPeriod
);

router.patch(
  '/:id',
  validateRequest(ClassPeriodValidation.updateClassPeriodZodSchema),
  ClassPeriodController.updateClassPeriod
);

router.delete(
  '/:id',
  validateRequest(ClassPeriodValidation.deleteClassPeriodZodSchema),
  ClassPeriodController.deleteClassPeriod
);

export default router;
