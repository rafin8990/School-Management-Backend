import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../../constants/pagination';
import catchAsync from '../../../../shared/catchAsync';
import pick from '../../../../shared/pick';
import sendResponse from '../../../../shared/sendResponse';
import { IClass } from './class.interface';
import { ClassService } from './class.service';

const createClass = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await ClassService.createClass(data);
  sendResponse<IClass>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Class created successfully',
    data: result,
  });
});

const getAllClasses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'name', 'status', 'school_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ClassService.getAllClasses(filters, paginationOptions);

  sendResponse<IClass[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Classes retrieved successfully',
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

const getSingleClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ClassService.getSingleClass(Number(id));
  sendResponse<IClass>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class retrieved successfully',
    data: result,
  });
});

const updateClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ClassService.updateClass(Number(id), data);
  sendResponse<IClass>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class updated successfully',
    data: result,
  });
});

const deleteClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ClassService.deleteClass(Number(id));
  sendResponse<IClass>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class deleted successfully',
    data: null,
  });
});

export const ClassController = {
  createClass,
  getAllClasses,
  getSingleClass,
  updateClass,
  deleteClass,
};


