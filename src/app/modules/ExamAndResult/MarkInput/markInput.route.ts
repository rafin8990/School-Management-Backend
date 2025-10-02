import express from 'express';
import { MarkInputController } from './markInput.controller';
import { MarkInputValidation } from './markInput.validation';
import validateRequest from '../../../middlewares/validateRequest';


const router = express.Router();

router.post(
  '/search-students',
  validateRequest(MarkInputValidation.searchStudentsZodSchema),
  MarkInputController.searchStudentsForMarkInput
);

router.post(
  '/save-marks',
  validateRequest(MarkInputValidation.saveMarkInputZodSchema),
  MarkInputController.saveMarkInput
);

router.post(
  '/bulk-upload',
  validateRequest(MarkInputValidation.bulkUploadMarkInputZodSchema),
  MarkInputController.bulkUploadMarkInput
);

router.post(
  '/delete-by-subject-wise',
  validateRequest(MarkInputValidation.deleteBySubjectWiseZodSchema),
  MarkInputController.deleteMarkInputBySubjectWise
);

router.post(
  '/',
  validateRequest(MarkInputValidation.createMarkInputZodSchema),
  MarkInputController.createMarkInput
);

router.get('/', MarkInputController.getAllMarkInputs);

router.get('/:id', MarkInputController.getSingleMarkInput);

router.patch(
  '/:id',
  validateRequest(MarkInputValidation.updateMarkInputZodSchema),
  MarkInputController.updateMarkInput
);

router.delete('/:id', MarkInputController.deleteMarkInput);

export const MarkInputRoutes = router;
