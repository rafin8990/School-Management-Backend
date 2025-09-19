import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { BoardExamController } from './boardExam.controller';
import { BoardExamValidation } from './boardExam.validation';

const router = Router();

router.get(
  '/',
  validateRequest(BoardExamValidation.getAllBoardExamsZodSchema),
  BoardExamController.getAllBoardExams
);

router.get(
  '/:id',
  validateRequest(BoardExamValidation.getBoardExamByIdZodSchema),
  BoardExamController.getBoardExamById
);

router.post(
  '/',
  validateRequest(BoardExamValidation.createBoardExamZodSchema),
  BoardExamController.createBoardExam
);

router.patch(
  '/:id',
  validateRequest(BoardExamValidation.updateBoardExamZodSchema),
  BoardExamController.updateBoardExam
);

router.delete(
  '/:id',
  validateRequest(BoardExamValidation.deleteBoardExamZodSchema),
  BoardExamController.deleteBoardExam
);

export const BoardExamRoutes = router;
