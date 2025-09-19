import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { IClassWithAssignments, IClassAssignmentResponse } from './class-assignment.interface';
import { ClassAssignmentService } from './class-assignment.service';

const getClassesWithAssignments = catchAsync(async (req: Request, res: Response) => {
  const { school_id } = req.query;
  const result = await ClassAssignmentService.getClassesWithAssignments(Number(school_id));
  
  sendResponse<IClassWithAssignments[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Classes with assignments retrieved successfully',
    data: result,
  });
});

const getClassAssignments = catchAsync(async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { school_id } = req.query;
  const result = await ClassAssignmentService.getClassAssignments(Number(classId), Number(school_id));
  
  sendResponse<IClassAssignmentResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class assignments retrieved successfully',
    data: result,
  });
});

export const ClassAssignmentController = {
  getClassesWithAssignments,
  getClassAssignments,
};
