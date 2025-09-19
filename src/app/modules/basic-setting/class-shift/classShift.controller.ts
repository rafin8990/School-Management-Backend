import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { ClassShiftService } from './classShift.service';
import { IClassShiftAssign } from './classShift.interface';

/**
 * @swagger
 * /basic-setting/class-shifts:
 *   get:
 *     tags: [ClassShift]
 *     summary: Get class-wise shift assignment
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
 *                     - $ref: '#/components/schemas/ClassShiftAssign'
 *                     - type: null
 */
const getByClass = catchAsync(async (req: Request, res: Response) => {
  const schoolId = Number(req.query.school_id);
  const classId = Number(req.query.class_id);
  const result = await ClassShiftService.getByClass(schoolId, classId);
  sendResponse<IClassShiftAssign | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class shift assignment fetched',
    data: result,
  });
});

/**
 * @swagger
 * /basic-setting/class-shifts:
 *   post:
 *     tags: [ClassShift]
 *     summary: Create or update class-wise shift assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertClassShiftRequest'
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
 *                   $ref: '#/components/schemas/ClassShiftAssign'
 */
const upsert = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as IClassShiftAssign;
  const result = await ClassShiftService.upsert(data);
  sendResponse<IClassShiftAssign>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class shift assignment saved',
    data: result,
  });
});

export const ClassShiftController = {
  getByClass,
  upsert,
};
