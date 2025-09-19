import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { AcademicSessionService } from './academicSession.service';
import { IAcademicSession } from './academicSession.interface';

/**
 * @swagger
 * /basic-setting/academic-sessions:
 *   get:
 *     tags: [AcademicSession]
 *     summary: Get all academic sessions
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
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
 *         description: Academic sessions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAcademicSessionResponse'
 */
const getAllAcademicSessions = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSessionService.getAllAcademicSessions(req.query as any);
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
 * /basic-setting/academic-sessions/{id}:
 *   get:
 *     tags: [AcademicSession]
 *     summary: Get academic session by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Academic session ID
 *     responses:
 *       200:
 *         description: Academic session fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleAcademicSessionResponse'
 */
const getAcademicSessionById = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSessionService.getAcademicSessionById(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

/**
 * @swagger
 * /basic-setting/academic-sessions:
 *   post:
 *     tags: [AcademicSession]
 *     summary: Create new academic session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAcademicSessionRequest'
 *     responses:
 *       201:
 *         description: Academic session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleAcademicSessionResponse'
 */
const createAcademicSession = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSessionService.createAcademicSession(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

/**
 * @swagger
 * /basic-setting/academic-sessions/{id}:
 *   patch:
 *     tags: [AcademicSession]
 *     summary: Update academic session
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Academic session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAcademicSessionRequest'
 *     responses:
 *       200:
 *         description: Academic session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleAcademicSessionResponse'
 */
const updateAcademicSession = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSessionService.updateAcademicSession(Number(req.params.id), req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

/**
 * @swagger
 * /basic-setting/academic-sessions/{id}:
 *   delete:
 *     tags: [AcademicSession]
 *     summary: Delete academic session
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Academic session ID
 *     responses:
 *       200:
 *         description: Academic session deleted successfully
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
const deleteAcademicSession = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSessionService.deleteAcademicSession(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
  });
});

export const AcademicSessionController = {
  getAllAcademicSessions,
  getAcademicSessionById,
  createAcademicSession,
  updateAcademicSession,
  deleteAcademicSession,
};
