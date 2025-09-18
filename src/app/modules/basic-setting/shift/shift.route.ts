import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ShiftController } from './shift.controller';
import { ShiftValidation } from './shift.validation';

const router = Router();

router.post(
  '/',
  validateRequest(ShiftValidation.createShiftZodSchema),
  ShiftController.createShift
);

router.get(
  '/',
  validateRequest(ShiftValidation.getAllShiftsZodSchema),
  ShiftController.getAllShifts
);

router.get(
  '/:id',
  validateRequest(ShiftValidation.getSingleShiftZodSchema),
  ShiftController.getSingleShift
);

router.patch(
  '/:id',
  validateRequest(ShiftValidation.updateShiftZodSchema),
  ShiftController.updateShift
);

router.delete(
  '/:id',
  validateRequest(ShiftValidation.deleteShiftZodSchema),
  ShiftController.deleteShift
);

export const ShiftRoutes = router;


