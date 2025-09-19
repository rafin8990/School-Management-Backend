import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { DesignationService } from './designation.service';
import { IDesignation } from './designation.interface';

const getAllDesignations = catchAsync(async (req: Request, res: Response) => {
  const result = await DesignationService.getAllDesignations(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    meta: result.meta,
    data: result.data,
  });
});

const getDesignationById = catchAsync(async (req: Request, res: Response) => {
  const result = await DesignationService.getDesignationById(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

const createDesignation = catchAsync(async (req: Request, res: Response) => {
  const result = await DesignationService.createDesignation(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

const updateDesignation = catchAsync(async (req: Request, res: Response) => {
  const result = await DesignationService.updateDesignation(Number(req.params.id), req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

const deleteDesignation = catchAsync(async (req: Request, res: Response) => {
  const result = await DesignationService.deleteDesignation(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
  });
});

export const DesignationController = {
  getAllDesignations,
  getDesignationById,
  createDesignation,
  updateDesignation,
  deleteDesignation,
};
