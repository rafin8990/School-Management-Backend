import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { BoardExamService } from './boardExam.service';
import { IBoardExam } from './boardExam.interface';

/**
 * @swagger
 * /basic-setting/board-exams:
 *   get:
 *     tags: [BoardExam]
 *     summary: Get all board exams
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term for name
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
 *       - in: query
 *         name: school_id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: School ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Board exams fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBoardExamResponse'
 */
const getAllBoardExams = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardExamService.getAllBoardExams(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    meta: result.meta,
    data: result.data,
  });
});

/**
 * @swagger
 * /basic-setting/board-exams/{id}:
 *   get:
 *     tags: [BoardExam]
 *     summary: Get board exam by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Board exam ID
 *     responses:
 *       200:
 *         description: Board exam fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleBoardExamResponse'
 */
const getBoardExamById = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardExamService.getBoardExamById(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

/**
 * @swagger
 * /basic-setting/board-exams:
 *   post:
 *     tags: [BoardExam]
 *     summary: Create new board exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBoardExamRequest'
 *     responses:
 *       201:
 *         description: Board exam created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleBoardExamResponse'
 */
const createBoardExam = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardExamService.createBoardExam(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

/**
 * @swagger
 * /basic-setting/board-exams/{id}:
 *   patch:
 *     tags: [BoardExam]
 *     summary: Update board exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Board exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBoardExamRequest'
 *     responses:
 *       200:
 *         description: Board exam updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleBoardExamResponse'
 */
const updateBoardExam = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardExamService.updateBoardExam(Number(req.params.id), req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

/**
 * @swagger
 * /basic-setting/board-exams/{id}:
 *   delete:
 *     tags: [BoardExam]
 *     summary: Delete board exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Board exam ID
 *     responses:
 *       200:
 *         description: Board exam deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
const deleteBoardExam = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardExamService.deleteBoardExam(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
  });
});

export const BoardExamController = {
  getAllBoardExams,
  getBoardExamById,
  createBoardExam,
  updateBoardExam,
  deleteBoardExam,
};
