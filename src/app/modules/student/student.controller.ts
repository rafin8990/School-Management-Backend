import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IStudent } from './student.interface';
import { StudentService } from './student.service';

/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Student management operations
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - student_name_en
 *         - group_id
 *         - class_id
 *         - shift_id
 *         - academic_year_id
 *         - school_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated student ID
 *         student_name_en:
 *           type: string
 *           maxLength: 150
 *           description: Student name in English
 *         student_name_bn:
 *           type: string
 *           maxLength: 150
 *           description: Student name in Bangla
 *         student_id:
 *           type: string
 *           maxLength: 100
 *           description: Custom student ID
 *         mobile:
 *           type: string
 *           maxLength: 20
 *           description: Student mobile number
 *         group_id:
 *           type: integer
 *           description: Group ID reference
 *         section_id:
 *           type: integer
 *           description: Section ID reference
 *         class_id:
 *           type: integer
 *           description: Class ID reference
 *         shift_id:
 *           type: integer
 *           description: Shift ID reference
 *         date_of_birth_en:
 *           type: string
 *           format: date
 *           description: Date of birth in English format
 *         date_of_birth_bn:
 *           type: string
 *           maxLength: 50
 *           description: Date of birth in Bangla format
 *         roll:
 *           type: integer
 *           description: Roll number
 *         category_id:
 *           type: integer
 *           description: Category ID reference
 *         blood_group:
 *           type: string
 *           enum: ['A', 'A+', 'A-', 'B', 'B+', 'B-', 'O', 'O+', 'O-', 'AB', 'AB+', 'AB-']
 *           description: Blood group
 *         gender:
 *           type: string
 *           maxLength: 20
 *           description: Gender
 *         national_id:
 *           type: string
 *           maxLength: 100
 *           description: National ID number
 *         nationality:
 *           type: string
 *           maxLength: 100
 *           default: 'Bangladeshi'
 *           description: Nationality
 *         religion:
 *           type: string
 *           maxLength: 50
 *           description: Religion
 *         session_id:
 *           type: integer
 *           description: Academic session ID reference
 *         academic_year_id:
 *           type: integer
 *           description: Academic year ID reference
 *         admission_date:
 *           type: string
 *           format: date
 *           description: Admission date
 *         student_photo:
 *           type: string
 *           description: Student photo URL
 *         father_name_en:
 *           type: string
 *           maxLength: 150
 *           description: Father's name in English
 *         father_name_bn:
 *           type: string
 *           maxLength: 150
 *           description: Father's name in Bangla
 *         father_nid:
 *           type: string
 *           maxLength: 100
 *           description: Father's National ID
 *         father_mobile:
 *           type: string
 *           maxLength: 20
 *           description: Father's mobile number
 *         father_dob_en:
 *           type: string
 *           format: date
 *           description: Father's date of birth in English format
 *         father_dob_bn:
 *           type: string
 *           maxLength: 50
 *           description: Father's date of birth in Bangla format
 *         father_occupation_en:
 *           type: string
 *           maxLength: 100
 *           description: Father's occupation in English
 *         father_occupation_bn:
 *           type: string
 *           maxLength: 100
 *           description: Father's occupation in Bangla
 *         father_income:
 *           type: number
 *           description: Father's annual income
 *         mother_name_en:
 *           type: string
 *           maxLength: 150
 *           description: Mother's name in English
 *         mother_name_bn:
 *           type: string
 *           maxLength: 150
 *           description: Mother's name in Bangla
 *         mother_nid:
 *           type: string
 *           maxLength: 100
 *           description: Mother's National ID
 *         mother_mobile:
 *           type: string
 *           maxLength: 20
 *           description: Mother's mobile number
 *         mother_dob_en:
 *           type: string
 *           format: date
 *           description: Mother's date of birth in English format
 *         mother_dob_bn:
 *           type: string
 *           maxLength: 50
 *           description: Mother's date of birth in Bangla format
 *         mother_occupation_en:
 *           type: string
 *           maxLength: 100
 *           description: Mother's occupation in English
 *         mother_occupation_bn:
 *           type: string
 *           maxLength: 100
 *           description: Mother's occupation in Bangla
 *         mother_income:
 *           type: number
 *           description: Mother's annual income
 *         current_village_en:
 *           type: string
 *           maxLength: 150
 *           description: Current village name in English
 *         current_village_bn:
 *           type: string
 *           maxLength: 150
 *           description: Current village name in Bangla
 *         current_post_office_en:
 *           type: string
 *           maxLength: 150
 *           description: Current post office in English
 *         current_post_office_bn:
 *           type: string
 *           maxLength: 150
 *           description: Current post office in Bangla
 *         current_post_code:
 *           type: string
 *           maxLength: 20
 *           description: Current post code
 *         current_district:
 *           type: integer
 *           description: Current district ID reference
 *         current_thana:
 *           type: integer
 *           description: Current thana ID reference
 *         permanent_village_en:
 *           type: string
 *           maxLength: 150
 *           description: Permanent village name in English
 *         permanent_village_bn:
 *           type: string
 *           maxLength: 150
 *           description: Permanent village name in Bangla
 *         permanent_post_office_en:
 *           type: string
 *           maxLength: 150
 *           description: Permanent post office in English
 *         permanent_post_office_bn:
 *           type: string
 *           maxLength: 150
 *           description: Permanent post office in Bangla
 *         permanent_post_code:
 *           type: string
 *           maxLength: 20
 *           description: Permanent post code
 *         permanent_district:
 *           type: integer
 *           description: Permanent district ID reference
 *         permanent_thana:
 *           type: integer
 *           description: Permanent thana ID reference
 *         guardian_name_en:
 *           type: string
 *           maxLength: 150
 *           description: Guardian's name in English
 *         guardian_name_bn:
 *           type: string
 *           maxLength: 150
 *           description: Guardian's name in Bangla
 *         guardian_address_en:
 *           type: string
 *           description: Guardian's address in English
 *         guardian_address_bn:
 *           type: string
 *           description: Guardian's address in Bangla
 *         last_institution:
 *           type: string
 *           maxLength: 200
 *           description: Last institution name
 *         last_class:
 *           type: string
 *           maxLength: 50
 *           description: Last class studied
 *         registration_number:
 *           type: string
 *           maxLength: 100
 *           description: Registration number
 *         result:
 *           type: string
 *           maxLength: 50
 *           description: Previous result
 *         year_passed:
 *           type: string
 *           maxLength: 10
 *           description: Year passed
 *         status:
 *           type: string
 *           enum: ['active', 'inactive']
 *           default: 'active'
 *           description: Student status
 *         password:
 *           type: string
 *           maxLength: 255
 *           default: '123456'
 *           description: Student password
 *         school_id:
 *           type: integer
 *           description: School ID reference
 *     
 *     CreateStudentRequest:
 *       type: object
 *       required:
 *         - student_name_en
 *         - group_id
 *         - class_id
 *         - shift_id
 *         - academic_year_id
 *         - school_id
 *       properties:
 *         student_name_en:
 *           type: string
 *           maxLength: 150
 *         student_name_bn:
 *           type: string
 *           maxLength: 150
 *         student_id:
 *           type: string
 *           maxLength: 100
 *         mobile:
 *           type: string
 *           maxLength: 20
 *         group_id:
 *           type: integer
 *         section_id:
 *           type: integer
 *         class_id:
 *           type: integer
 *         shift_id:
 *           type: integer
 *         date_of_birth_en:
 *           type: string
 *           format: date
 *         date_of_birth_bn:
 *           type: string
 *           maxLength: 50
 *         roll:
 *           type: integer
 *         category_id:
 *           type: integer
 *         blood_group:
 *           type: string
 *           enum: ['A', 'A+', 'A-', 'B', 'B+', 'B-', 'O', 'O+', 'O-', 'AB', 'AB+', 'AB-']
 *         gender:
 *           type: string
 *           maxLength: 20
 *         national_id:
 *           type: string
 *           maxLength: 100
 *         nationality:
 *           type: string
 *           maxLength: 100
 *         religion:
 *           type: string
 *           maxLength: 50
 *         session_id:
 *           type: integer
 *         academic_year_id:
 *           type: integer
 *         admission_date:
 *           type: string
 *           format: date
 *         student_photo:
 *           type: string
 *         father_name_en:
 *           type: string
 *           maxLength: 150
 *         father_name_bn:
 *           type: string
 *           maxLength: 150
 *         father_nid:
 *           type: string
 *           maxLength: 100
 *         father_mobile:
 *           type: string
 *           maxLength: 20
 *         father_dob_en:
 *           type: string
 *           format: date
 *         father_dob_bn:
 *           type: string
 *           maxLength: 50
 *         father_occupation_en:
 *           type: string
 *           maxLength: 100
 *         father_occupation_bn:
 *           type: string
 *           maxLength: 100
 *         father_income:
 *           type: number
 *         mother_name_en:
 *           type: string
 *           maxLength: 150
 *         mother_name_bn:
 *           type: string
 *           maxLength: 150
 *         mother_nid:
 *           type: string
 *           maxLength: 100
 *         mother_mobile:
 *           type: string
 *           maxLength: 20
 *         mother_dob_en:
 *           type: string
 *           format: date
 *         mother_dob_bn:
 *           type: string
 *           maxLength: 50
 *         mother_occupation_en:
 *           type: string
 *           maxLength: 100
 *         mother_occupation_bn:
 *           type: string
 *           maxLength: 100
 *         mother_income:
 *           type: number
 *         current_village_en:
 *           type: string
 *           maxLength: 150
 *         current_village_bn:
 *           type: string
 *           maxLength: 150
 *         current_post_office_en:
 *           type: string
 *           maxLength: 150
 *         current_post_office_bn:
 *           type: string
 *           maxLength: 150
 *         current_post_code:
 *           type: string
 *           maxLength: 20
 *         current_district:
 *           type: integer
 *         current_thana:
 *           type: integer
 *         permanent_village_en:
 *           type: string
 *           maxLength: 150
 *         permanent_village_bn:
 *           type: string
 *           maxLength: 150
 *         permanent_post_office_en:
 *           type: string
 *           maxLength: 150
 *         permanent_post_office_bn:
 *           type: string
 *           maxLength: 150
 *         permanent_post_code:
 *           type: string
 *           maxLength: 20
 *         permanent_district:
 *           type: integer
 *         permanent_thana:
 *           type: integer
 *         guardian_name_en:
 *           type: string
 *           maxLength: 150
 *         guardian_name_bn:
 *           type: string
 *           maxLength: 150
 *         guardian_address_en:
 *           type: string
 *         guardian_address_bn:
 *           type: string
 *         last_institution:
 *           type: string
 *           maxLength: 200
 *         last_class:
 *           type: string
 *           maxLength: 50
 *         registration_number:
 *           type: string
 *           maxLength: 100
 *         result:
 *           type: string
 *           maxLength: 50
 *         year_passed:
 *           type: string
 *           maxLength: 10
 *         status:
 *           type: string
 *           enum: ['active', 'inactive']
 *         password:
 *           type: string
 *           maxLength: 255
 *         school_id:
 *           type: integer
 *     
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         meta:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             hasNext:
 *               type: boolean
 *             hasPrev:
 *               type: boolean
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errorMessages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *               message:
 *                 type: string
 */

/**
 * @swagger
 * /api/v1/students:
 *   post:
 *     summary: Create a new student
 *     description: Create a new student with comprehensive information including English and Bangla fields
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *           example:
 *             student_name_en: "John Doe"
 *             student_name_bn: "জন ডো"
 *             student_id: "2025001"
 *             mobile: "01984419614"
 *             group_id: 1
 *             class_id: 1
 *             shift_id: 1
 *             academic_year_id: 4
 *             school_id: 1
 *             father_name_en: "Robert Doe"
 *             father_name_bn: "রবার্ট ডো"
 *             mother_name_en: "Jane Doe"
 *             mother_name_bn: "জেন ডো"
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict - student ID already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const createStudent = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await StudentService.createStudent(data);
  sendResponse<IStudent>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

/**
 * @swagger
 * /api/v1/students:
 *   get:
 *     summary: Get all students with filtering and pagination
 *     description: Retrieve a paginated list of students with optional filtering
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term for student name or ID
 *       - in: query
 *         name: student_name_en
 *         schema:
 *           type: string
 *         description: Filter by student name in English
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: mobile
 *         schema:
 *           type: string
 *         description: Filter by mobile number
 *       - in: query
 *         name: class_id
 *         schema:
 *           type: integer
 *         description: Filter by class ID
 *       - in: query
 *         name: group_id
 *         schema:
 *           type: integer
 *         description: Filter by group ID
 *       - in: query
 *         name: section_id
 *         schema:
 *           type: integer
 *         description: Filter by section ID
 *       - in: query
 *         name: shift_id
 *         schema:
 *           type: integer
 *         description: Filter by shift ID
 *       - in: query
 *         name: academic_year_id
 *         schema:
 *           type: integer
 *         description: Filter by academic year ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by student status
 *       - in: query
 *         name: school_id
 *         schema:
 *           type: integer
 *         description: Filter by school ID
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
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Student'
 *                     meta:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    'student_name_en',
    'student_id',
    'mobile',
    'class_id',
    'group_id',
    'section_id',
    'shift_id',
    'academic_year_id',
    'session_id',
    'status',
    'school_id',
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await StudentService.getAllStudents(filters, paginationOptions);

  sendResponse<IStudent[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully',
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
 * /api/v1/students/{id}:
 *   get:
 *     summary: Get a single student by ID
 *     description: Retrieve detailed information about a specific student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request - invalid student ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.getSingleStudent(Number(id));
  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await StudentService.updateStudent(Number(id), data);
  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});

/**
 * @swagger
 * /api/v1/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Delete a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - invalid student ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await StudentService.deleteStudent(Number(id));
  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully',
    data: null,
  });
});

/**
 * @swagger
 * /api/v1/students/generate-student-id:
 *   get:
 *     summary: Generate a unique student ID
 *     description: Generate a unique student ID for a specific school
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: school_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: School ID
 *     responses:
 *       200:
 *         description: Student ID generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: string
 *                       example: "2025001"
 *       400:
 *         description: Bad request - invalid school ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const generateStudentId = catchAsync(async (req: Request, res: Response) => {
  const { school_id } = req.query;
  const result = await StudentService.generateStudentId(Number(school_id));
  sendResponse<string>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student ID generated successfully',
    data: result,
  });
});

/**
 * @swagger
 * /api/v1/students/classes-with-assignments:
 *   get:
 *     summary: Get classes with assignments
 *     description: Retrieve classes with their assignments for a specific school
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: school_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: School ID
 *     responses:
 *       200:
 *         description: Classes with assignments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           class_id:
 *                             type: integer
 *                           class_name:
 *                             type: string
 *                           assignments:
 *                             type: array
 *                             items:
 *                               type: object
 *       400:
 *         description: Bad request - invalid school ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const getClassesWithAssignments = catchAsync(async (req: Request, res: Response) => {
  const { school_id } = req.query;
  const result = await StudentService.getClassesWithAssignments(Number(school_id));
  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Classes with assignments retrieved successfully',
    data: result,
  });
});

const bulkUpdateStudents = catchAsync(async (req: Request, res: Response) => {
  console.log('Bulk update request received:', {
    method: req.method,
    headers: req.headers,
    body: req.body,
    schoolId: req.header('X-School-Id')
  });

  const schoolId = Number(req.header('X-School-Id'));
  if (!schoolId || isNaN(schoolId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'X-School-Id header is required and must be a valid number');
  }

  if (!Array.isArray(req.body)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be an array');
  }
  
  console.log('Processing bulk update for school:', schoolId, 'with', req.body.length, 'patches');
  const result = await StudentService.bulkUpdateStudents(req.body, schoolId);

  console.log('Bulk update result:', result);
  res.status(200).json({
    success: true,
    message: `Updated ${result.updatedCount} students`,
    updatedCount: result.updatedCount,
    failed: result.failed,
    rows: result.rows,
  });
});

/**
 * @swagger
 * /api/v1/students/bulk-create:
 *   post:
 *     summary: Create multiple students at once
 *     description: Create multiple students with bulk data including auto-generated student IDs
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - students
 *             properties:
 *               students:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 100
 *                 items:
 *                   $ref: '#/components/schemas/CreateStudentRequest'
 *           example:
 *             students:
 *               - student_name_en: "John Doe"
 *                 student_name_bn: "জন ডো"
 *                 mobile: "01984419614"
 *                 group_id: 1
 *                 class_id: 1
 *                 shift_id: 1
 *                 academic_year_id: 4
 *                 school_id: 1
 *                 father_name_en: "Robert Doe"
 *                 mother_name_en: "Jane Doe"
 *               - student_name_en: "Jane Smith"
 *                 student_name_bn: "জেন স্মিথ"
 *                 mobile: "01984419615"
 *                 group_id: 1
 *                 class_id: 1
 *                 shift_id: 1
 *                 academic_year_id: 4
 *                 school_id: 1
 *                 father_name_en: "John Smith"
 *                 mother_name_en: "Mary Smith"
 *     responses:
 *       201:
 *         description: Students created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict - one or more student IDs already exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const bulkCreateStudents = catchAsync(async (req: Request, res: Response) => {
  const { students } = req.body;
  const result = await StudentService.bulkCreateStudents(students);
  sendResponse<IStudent[]>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${result.length} students created successfully`,
    data: result,
  });
});

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  generateStudentId,
  getClassesWithAssignments,
  bulkUpdateStudents,
  bulkCreateStudents,
  // will be defined later in file
  importStudentsFromExcel: (() => { throw new Error('not initialized'); }) as any,
  searchStudentsForMigration: (() => { throw new Error('not initialized'); }) as any,
  migrateStudents: (() => { throw new Error('not initialized'); }) as any,
  softDeleteStudents: (() => { throw new Error('not initialized'); }) as any,
};

// New: Import students from Excel
export const importStudentsFromExcel = catchAsync(async (req: Request, res: Response) => {
  const schoolId = Number(req.headers['x-school-id'] || req.body.school_id || 0);
  const classId = Number(req.body.class_id);
  const groupId = Number(req.body.group_id);
  const shiftId = Number(req.body.shift_id);
  const academicYearId = Number(req.body.academic_year_id);
  const sectionId = req.body.section_id ? Number(req.body.section_id) : undefined;
  const categoryId = req.body.category_id ? Number(req.body.category_id) : undefined;
  const studentIdType = String(req.body.student_id_type || 'with-id');

  if (!schoolId || !classId || !groupId || !shiftId || !academicYearId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'class_id, group_id, shift_id, academic_year_id and X-School-Id are required');
  }

  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Excel file is required');
  }

  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const json: Array<Record<string, any>> = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  // Helper: normalize header keys for robust matching (case/space/punctuation/Bangla safe)
  const normalizeKey = (key: string): string =>
    String(key || '')
      .toLowerCase()
      .replace(/['`.]/g, '')
      .replace(/\s+/g, '')
      .replace(/[_-]+/g, '')
      .trim();

  const variants = {
    name: new Set([
      'name', 'studentname', 'student_name_en', 'studentnameen', 'student_name', 'nam',
      // Bangla
      'নাম', 'শিক্ষার্থীরনাম', 'শিক্ষার্থীর নাম'
    ].map(normalizeKey)),
    studentId: new Set([
      'studentid', 'student_id', 'id',
      'আইডি', 'শিক্ষার্থীআইডি'
    ].map(normalizeKey)),
    roll: new Set([
      'rollno', 'rollno.', 'roll', 'rollnumber',
      'রোল'
    ].map(normalizeKey)),
    gender: new Set([
      'gender', 'লিঙ্গ'
    ].map(normalizeKey)),
    dob: new Set([
      'dateofbirth', 'dob', 'birthdate', 'dateofbirth(en)',
      'জন্মতারিখ'
    ].map(normalizeKey)),
    religion: new Set([
      'religion', 'ধর্ম'
    ].map(normalizeKey)),
    fatherName: new Set([
      "father'sname", 'fathername', 'father', 'father_name_en',
      'পিতারনাম', 'বাবারনাম'
    ].map(normalizeKey)),
    motherName: new Set([
      "mother'sname", 'mothername', 'mother', 'mother_name_en',
      'মাতারনাম', 'মায়েরনাম'
    ].map(normalizeKey)),
    mobile: new Set([
      'mobileno', 'mobileno.', 'mobile', 'phonenumber', 'phone',
      'মোবাইল', 'মোবাইলনম্বর'
    ].map(normalizeKey)),
  } as const;

  // Excel date conversion helper (handles serial numbers)
  const toIsoDate = (val: any): string | undefined => {
    if (!val) return undefined;
    if (typeof val === 'string') {
      const d = new Date(val);
      return isNaN(d.getTime()) ? undefined : d.toISOString().split('T')[0];
    }
    if (typeof val === 'number') {
      // Excel date serial -> JS Date (Excel epoch 1899-12-30)
      const epoch = new Date(Math.round((val - 25569) * 86400 * 1000));
      return isNaN(epoch.getTime()) ? undefined : epoch.toISOString().split('T')[0];
    }
    return undefined;
  };

  const students = json
    .map((row) => {
      // Build normalized key map
      const norm: Record<string, any> = {};
      Object.keys(row).forEach((k) => {
        norm[normalizeKey(k)] = row[k];
      });

      const pick = (keys: ReadonlySet<string>) => {
        for (const k of Object.keys(norm)) {
          if (keys.has(k)) return norm[k];
        }
        return '';
      };

      const studentName = pick(variants.name);
      const studentId = pick(variants.studentId);
      const roll = pick(variants.roll);
      const gender = pick(variants.gender);
      const dob = pick(variants.dob);
      const religion = pick(variants.religion);
      const fatherName = pick(variants.fatherName);
      const motherName = pick(variants.motherName);
      const mobile = pick(variants.mobile);

      // Skip empty rows (no name)
      if (!String(studentName || '').trim()) {
        return null;
      }

      const s: Partial<IStudent> = {
        student_name_en: String(studentName).trim(),
        student_id:
          studentIdType === 'with-id' && String(studentId).trim() !== ''
            ? String(studentId).trim()
            : undefined,
        roll: String(roll).trim() !== '' && !isNaN(Number(roll)) ? Number(roll) : undefined,
        gender: String(gender || '').trim().toLowerCase() || undefined,
        date_of_birth_en: toIsoDate(dob),
        religion: String(religion || '').trim() || undefined,
        father_name_en: String(fatherName || '').trim() || undefined,
        mother_name_en: String(motherName || '').trim() || undefined,
        mobile: String(mobile || '').trim() || undefined,
        class_id: classId,
        group_id: groupId,
        section_id: sectionId,
        shift_id: shiftId,
        category_id: categoryId,
        academic_year_id: academicYearId,
        school_id: schoolId,
        status: 'active',
      } as Partial<IStudent>;

      return s;
    })
    .filter(Boolean) as Partial<IStudent>[];

  if (students.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No valid rows found in the Excel file');
  }

  const result = await StudentService.bulkCreateStudents(students as any);

  sendResponse<IStudent[]>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${result.length} students imported successfully`,
    data: result,
  });
});

// re-export default object with new method for route import
Object.assign(StudentController, { importStudentsFromExcel });

// Migration: search students based on source filters
export const searchStudentsForMigration = catchAsync(async (req: Request, res: Response) => {
  const schoolId = Number(req.headers['x-school-id'] || req.query.school_id || req.body.school_id || 0);
  const { class_id, group_id, section_id, academic_year_id } = req.body;

  if (!schoolId || !class_id || !academic_year_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'school_id, class_id and academic_year_id are required');
  }

  const result = await StudentService.searchForMigration({
    school_id: schoolId,
    class_id: Number(class_id),
    group_id: group_id ? Number(group_id) : undefined,
    section_id: section_id ? Number(section_id) : undefined,
    academic_year_id: Number(academic_year_id),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students loaded',
    data: result,
  });
});

// Migration: execute migration for selected students
export const migrateStudents = catchAsync(async (req: Request, res: Response) => {
  const schoolId = Number(req.headers['x-school-id'] || req.body.school_id || 0);
  const { student_ids, target } = req.body as {
    student_ids: number[];
    target: {
      class_id: number;
      academic_year_id: number;
      group_id?: number;
      section_id?: number;
      shift_id: number;
    };
  };

  if (!schoolId) throw new ApiError(httpStatus.BAD_REQUEST, 'school_id is required');
  if (!Array.isArray(student_ids) || student_ids.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'student_ids array is required');
  }
  if (!target?.class_id || !target?.shift_id || !target?.academic_year_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'target class_id, shift_id, academic_year_id are required');
  }

  const result = await StudentService.migrateStudents({
    school_id: schoolId,
    student_ids,
    target,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result.updated} students migrated successfully`,
    data: result.rows,
  });
});

Object.assign(StudentController, { searchStudentsForMigration, migrateStudents });

// Soft delete students (set disabled=true)
export const softDeleteStudents = catchAsync(async (req: Request, res: Response) => {
  const schoolId = Number(req.headers['x-school-id'] || req.body.school_id || 0);
  const { student_ids } = req.body as { student_ids: number[] };
  if (!schoolId) throw new ApiError(httpStatus.BAD_REQUEST, 'school_id is required');
  if (!Array.isArray(student_ids) || student_ids.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'student_ids array is required');
  }
  const result = await StudentService.softDeleteStudents(schoolId, student_ids);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result.updated} students disabled successfully`,
    data: result.rows,
  });
});

Object.assign(StudentController, { softDeleteStudents });
