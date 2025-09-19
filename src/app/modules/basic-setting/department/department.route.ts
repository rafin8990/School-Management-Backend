import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { DepartmentController } from './department.controller';
import { DepartmentValidation } from './department.validation';

const router = Router();

router.get(
  '/',
  validateRequest(DepartmentValidation.getAllDepartmentsZodSchema),
  DepartmentController.getAllDepartments
);

router.get(
  '/:id',
  validateRequest(DepartmentValidation.getDepartmentByIdZodSchema),
  DepartmentController.getDepartmentById
);

router.post(
  '/',
  validateRequest(DepartmentValidation.createDepartmentZodSchema),
  DepartmentController.createDepartment
);

router.patch(
  '/:id',
  validateRequest(DepartmentValidation.updateDepartmentZodSchema),
  DepartmentController.updateDepartment
);

router.delete(
  '/:id',
  validateRequest(DepartmentValidation.deleteDepartmentZodSchema),
  DepartmentController.deleteDepartment
);

export const DepartmentRoutes = router;
