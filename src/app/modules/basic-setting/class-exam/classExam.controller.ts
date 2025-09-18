import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../../constants/pagination';
import catchAsync from '../../../../shared/catchAsync';
import pick from '../../../../shared/pick';
import sendResponse from '../../../../shared/sendResponse';
import { IClassExam } from './classExam.interface';
import { ClassExamService } from './classExam.service';

const createClassExam = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await ClassExamService.createClassExam(data);
  sendResponse<IClassExam>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Class exam created successfully',
    data: result,
  });
});

const getAllClassExams = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'class_exam_name', 'status', 'school_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ClassExamService.getAllClassExams(filters, paginationOptions);

  sendResponse<IClassExam[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class exams retrieved successfully',
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

const getSingleClassExam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ClassExamService.getSingleClassExam(Number(id));
  sendResponse<IClassExam>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class exam retrieved successfully',
    data: result,
  });
});

const updateClassExam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ClassExamService.updateClassExam(Number(id), data);
  sendResponse<IClassExam>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class exam updated successfully',
    data: result,
  });
});

const deleteClassExam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ClassExamService.deleteClassExam(Number(id));
  sendResponse<IClassExam>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class exam deleted successfully',
    data: null,
  });
});

export const ClassExamController = {
  createClassExam,
  getAllClassExams,
  getSingleClassExam,
  updateClassExam,
  deleteClassExam,
};


