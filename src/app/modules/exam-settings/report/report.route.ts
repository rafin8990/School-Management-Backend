import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ReportValidation } from './report.validation';
import { ReportController } from './report.controller';

const router = express.Router();

router.get('/', validateRequest(ReportValidation.getAllZodSchema), ReportController.getAll);
router.get('/:id', validateRequest(ReportValidation.getByIdZodSchema), ReportController.getById);
router.post('/', validateRequest(ReportValidation.createZodSchema), ReportController.create);
router.patch('/:id', validateRequest(ReportValidation.updateZodSchema), ReportController.update);
router.delete('/:id', validateRequest(ReportValidation.idParamZodSchema), ReportController.remove);

export const ReportRoutes = router;
