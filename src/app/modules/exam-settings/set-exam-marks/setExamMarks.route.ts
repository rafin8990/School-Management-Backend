import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { SetExamMarksValidation } from './setExamMarks.validation';
import { SetExamMarksController } from './setExamMarks.controller';

const router = express.Router();

router.get('/', validateRequest(SetExamMarksValidation.searchZodSchema), SetExamMarksController.search);
router.post('/', validateRequest(SetExamMarksValidation.upsertZodSchema), SetExamMarksController.upsert);

export const SetExamMarksRoutes = router;


