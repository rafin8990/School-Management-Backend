import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { AcademicYearService } from './academicYear.service';


const getAllAcademicYears = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.getAllAcademicYears(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    meta: result.meta,
    data: result.data,
  });
});

const getAcademicYearById = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.getAcademicYearById(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

const createAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.createAcademicYear(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

const updateAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.updateAcademicYear(Number(req.params.id), req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result.data,
  });
});

const deleteAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.deleteAcademicYear(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
  });
});

export const AcademicYearController = {
  getAllAcademicYears,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};
