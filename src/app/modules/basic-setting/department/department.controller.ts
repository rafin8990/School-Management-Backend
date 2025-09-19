import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { DepartmentService } from './department.service';
import { IDepartment } from './department.interface';

const getAllDepartments = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentService.getAllDepartments(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    meta: result.meta,
    data: result.data,
  });
});

const getDepartmentById = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentService.getDepartmentById(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

const createDepartment = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentService.createDepartment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

const updateDepartment = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentService.updateDepartment(Number(req.params.id), req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

const deleteDepartment = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentService.deleteDepartment(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
  });
});

export const DepartmentController = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
