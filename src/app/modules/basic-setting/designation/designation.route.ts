import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { DesignationController } from './designation.controller';
import { DesignationValidation } from './designation.validation';

const router = Router();

router.get(
  '/',
  validateRequest(DesignationValidation.getAllDesignationsZodSchema),
  DesignationController.getAllDesignations
);

router.get(
  '/:id',
  validateRequest(DesignationValidation.getDesignationByIdZodSchema),
  DesignationController.getDesignationById
);

router.post(
  '/',
  validateRequest(DesignationValidation.createDesignationZodSchema),
  DesignationController.createDesignation
);

router.patch(
  '/:id',
  validateRequest(DesignationValidation.updateDesignationZodSchema),
  DesignationController.updateDesignation
);

router.delete(
  '/:id',
  validateRequest(DesignationValidation.deleteDesignationZodSchema),
  DesignationController.deleteDesignation
);

export const DesignationRoutes = router;
