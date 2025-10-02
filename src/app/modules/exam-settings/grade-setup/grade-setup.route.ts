import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { GradeSetupValidation } from './grade-setup.validation';
import { GradeSetupController } from './grade-setup.controller';

const router = express.Router();

// Grade Setup routes
router.get('/by-exam-year', validateRequest(GradeSetupValidation.getByExamAndYearZodSchema), GradeSetupController.getByExamAndYear);
router.get('/:id', validateRequest(GradeSetupValidation.getByIdZodSchema), GradeSetupController.getById);
router.post('/', validateRequest(GradeSetupValidation.createZodSchema), GradeSetupController.create);
router.post('/upsert', validateRequest(GradeSetupValidation.upsertGradeSetupZodSchema), GradeSetupController.upsertGradeSetup);
router.patch('/:id', validateRequest(GradeSetupValidation.updateZodSchema), GradeSetupController.update);
router.delete('/:id', validateRequest(GradeSetupValidation.idParamZodSchema), GradeSetupController.remove);

// Grade Point Setup routes
router.get('/:gradeSetupId/grade-points', validateRequest(GradeSetupValidation.getGradePointsBySetupIdZodSchema), GradeSetupController.getGradePointsBySetupId);
router.post('/grade-points', validateRequest(GradeSetupValidation.createGradePointZodSchema), GradeSetupController.createGradePoint);
router.patch('/grade-points/:id', validateRequest(GradeSetupValidation.updateGradePointZodSchema), GradeSetupController.updateGradePoint);
router.delete('/grade-points/:id', validateRequest(GradeSetupValidation.idParamZodSchema), GradeSetupController.deleteGradePoint);
router.post('/grade-points/bulk-upsert', validateRequest(GradeSetupValidation.bulkUpsertGradePointsZodSchema), GradeSetupController.bulkUpsertGradePoints);

export const GradeSetupRoutes = router;
