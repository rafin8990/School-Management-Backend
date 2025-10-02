import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { GradeValidation } from './grade.validation';
import { GradeController } from './grade.controller';

const router = express.Router();

router.get('/', validateRequest(GradeValidation.getAllZodSchema), GradeController.getAll);
router.get('/:id', validateRequest(GradeValidation.getByIdZodSchema), GradeController.getById);
router.post('/', validateRequest(GradeValidation.createZodSchema), GradeController.create);
router.post('/bulk', validateRequest(GradeValidation.bulkCreateZodSchema), GradeController.bulkCreate);
router.patch('/:id', validateRequest(GradeValidation.updateZodSchema), GradeController.update);
router.patch('/bulk', validateRequest(GradeValidation.bulkUpdateZodSchema), GradeController.bulkUpdate);
router.delete('/:id', validateRequest(GradeValidation.idParamZodSchema), GradeController.remove);

export const GradeRoutes = router;
