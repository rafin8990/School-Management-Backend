import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { ClassGroupService } from './classGroup.service';
import { IClassGroupAssign } from './classGroup.interface';

const getByClass = catchAsync(async (req: Request, res: Response) => {
  const schoolId = Number(req.query.school_id);
  const classId = Number(req.query.class_id);
  const result = await ClassGroupService.getByClass(schoolId, classId);
  sendResponse<IClassGroupAssign | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class group assignment fetched',
    data: result,
  });
});

const upsert = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as IClassGroupAssign;
  const result = await ClassGroupService.upsert(data);
  sendResponse<IClassGroupAssign>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class group assignment saved',
    data: result,
  });
});

export const ClassGroupController = {
  getByClass,
  upsert,
};


