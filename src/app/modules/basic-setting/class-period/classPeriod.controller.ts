import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../../constants/pagination';
import catchAsync from '../../../../shared/catchAsync';
import pick from '../../../../shared/pick';
import sendResponse from '../../../../shared/sendResponse';
import { IClassPeriod } from './classPeriod.interface';
import { ClassPeriodService } from './classPeriod.service';

/**
 * @swagger
 * components:
 *   schemas:
 *     ClassPeriod:
 *       type: object
 *       required:
 *         - name
 *         - school_id
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-incremental ID
 *         name:
 *           type: string
 *           description: Class period name (e.g., "1st Period", "2nd Period")
 *           maxLength: 255
 *         serial_number:
 *           type: integer
 *           nullable: true
 *           description: Position/order of the class period
 *         school_id:
 *           type: integer
 *           description: Foreign key reference to school table
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Status of the class period
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     CreateClassPeriodRequest:
 *       type: object
 *       required:
 *         - name
 *         - school_id
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           description: Class period name
 *           example: "1st Period"
 *         serial_number:
 *           type: integer
 *           nullable: true
 *           description: Position/order number
 *           example: 1
 *         school_id:
 *           type: integer
 *           description: School ID
 *           example: 1
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Status of the class period
 *           example: "active"
 *     
 *     UpdateClassPeriodRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Class period name
 *           example: "1st Period"
 *         serial_number:
 *           type: integer
 *           nullable: true
 *           description: Position/order number
 *           example: 1
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Status of the class period
 *           example: "active"
 *     
 *     ClassPeriodResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Class period created successfully"
 *         data:
 *           $ref: '#/components/schemas/ClassPeriod'
 *     
 *     ClassPeriodListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Class periods retrieved successfully"
 *         meta:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 25
 *             totalPages:
 *               type: integer
 *               example: 3
 *             hasNext:
 *               type: boolean
 *               example: true
 *             hasPrev:
 *               type: boolean
 *               example: false
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClassPeriod'
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message"
 *         error:
 *           type: object
 *           description: Error details
 */

/**
 * @swagger
 * /basic-setting/class-periods:
 *   post:
 *     tags: [Class Period]
 *     summary: Create a new class period
 *     description: Create a new class period for a specific school
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClassPeriodRequest'
 *     responses:
 *       201:
 *         description: Class period created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassPeriodResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
const createClassPeriod = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await ClassPeriodService.createClassPeriod(data);
  
  sendResponse<IClassPeriod>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Class period created successfully',
    data: result,
  });
});

/**
 * @swagger
 * /basic-setting/class-periods:
 *   get:
 *     tags: [Class Period]
 *     summary: Get all class periods
 *     description: Retrieve a paginated list of class periods for a specific school with optional filtering and searching
 *     parameters:
 *       - in: query
 *         name: school_id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: School ID to filter class periods
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term to filter class periods by name
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by exact class period name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, serial_number, created_at, updated_at]
 *           default: serial_number
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Class periods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassPeriodListResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
const getAllClassPeriods = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'name', 'status', 'school_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ClassPeriodService.getAllClassPeriods(filters, paginationOptions);

  sendResponse<IClassPeriod[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class periods retrieved successfully',
    meta: result.meta
      ? {
          page: result.meta.page ?? 1,
          limit: result.meta.limit ?? 10,
          total: result.meta.total,
          totalPages: result.meta.totalPages,
          hasNext: result.meta.hasNext,
          hasPrev: result.meta.hasPrev,
        }
      : undefined,
    data: result.data,
  });
});

/**
 * @swagger
 * /basic-setting/class-periods/{id}:
 *   get:
 *     tags: [Class Period]
 *     summary: Get class period by ID
 *     description: Retrieve a specific class period by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Class period ID
 *     responses:
 *       200:
 *         description: Class period retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassPeriodResponse'
 *       404:
 *         description: Class period not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
const getClassPeriodById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ClassPeriodService.getClassPeriodById(Number(id));
  
  if (!result) {
    return sendResponse<IClassPeriod>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Class period not found',
      data: null as any,
    });
  }
  
  sendResponse<IClassPeriod>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class period retrieved successfully',
    data: result,
  });
});

/**
 * @swagger
 * /basic-setting/class-periods/{id}:
 *   patch:
 *     tags: [Class Period]
 *     summary: Update class period
 *     description: Update an existing class period by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Class period ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClassPeriodRequest'
 *     responses:
 *       200:
 *         description: Class period updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassPeriodResponse'
 *       404:
 *         description: Class period not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
const updateClassPeriod = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ClassPeriodService.updateClassPeriod(Number(id), data);
  
  if (!result) {
    return sendResponse<IClassPeriod>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Class period not found',
      data: null as any,
    });
  }
  
  sendResponse<IClassPeriod>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class period updated successfully',
    data: result,
  });
});

/**
 * @swagger
 * /basic-setting/class-periods/{id}:
 *   delete:
 *     tags: [Class Period]
 *     summary: Delete class period
 *     description: Delete a class period by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Class period ID
 *     responses:
 *       200:
 *         description: Class period deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Class period deleted successfully"
 *       404:
 *         description: Class period not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
const deleteClassPeriod = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ClassPeriodService.deleteClassPeriod(Number(id));
  
  if (!result) {
    return sendResponse<IClassPeriod>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Class period not found',
      data: null as any,
    });
  }
  
  sendResponse<IClassPeriod>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class period deleted successfully',
    data: null as any,
  });
});

export const ClassPeriodController = {
  createClassPeriod,
  getAllClassPeriods,
  getClassPeriodById,
  updateClassPeriod,
  deleteClassPeriod,
};
