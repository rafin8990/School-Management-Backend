import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { ClassSectionService } from './classSection.service';
import { IClassSectionAssign } from './classSection.interface';

/**
 * @swagger
 * /basic-setting/class-sections:
 *   get:
 *     tags: [ClassSection]
 *     summary: Get class-wise section assignment
 *     parameters:
 *       - in: query
 *         name: school_id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: School ID
 *       - in: query
 *         name: class_id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Assignment fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/ClassSectionAssign'
 *                     - type: null
 */
const getByClass = catchAsync(async (req: Request, res: Response) => {
  const schoolId = Number(req.query.school_id);
  const classId = Number(req.query.class_id);
  const result = await ClassSectionService.getByClass(schoolId, classId);
  sendResponse<IClassSectionAssign | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class section assignment fetched',
    data: result,
  });
});

/**
 * @swagger
 * /basic-setting/class-sections:
 *   post:
 *     tags: [ClassSection]
 *     summary: Create or update class-wise section assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertClassSectionRequest'
 *     responses:
 *       200:
 *         description: Assignment saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ClassSectionAssign'
 */
const upsert = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as IClassSectionAssign;
  const result = await ClassSectionService.upsert(data);
  sendResponse<IClassSectionAssign>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class section assignment saved',
    data: result,
  });
});

export const ClassSectionController = {
  getByClass,
  upsert,
};
