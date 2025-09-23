import { Request, Response } from 'express';
import { TransferCertificateService } from './transferCertificate.service';
import { transferCertificateQueryValidationSchema, transferCertificateParamsValidationSchema } from './transferCertificate.validation';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createTransferCertificate = catchAsync(async (req: Request, res: Response) => {
  const transferCertificateData = {
    ...req.body,
    created_by: req.user?.id || null, // Set to null if no user
    updated_by: req.user?.id || null, // Set to null if no user
  };
  
  // Check if certificate already exists for this student
  const existingCertificate = await TransferCertificateService.getTransferCertificatesByStudent(
    transferCertificateData.student_id
  );
  
  const result = await TransferCertificateService.createTransferCertificate(transferCertificateData);
  
  const isUpdate = existingCertificate.length > 0;
  
  sendResponse(res, {
    statusCode: isUpdate ? httpStatus.OK : httpStatus.CREATED,
    success: true,
    message: isUpdate 
      ? 'Transfer certificate updated successfully' 
      : 'Transfer certificate created successfully',
    data: result,
  });
});

const getAllTransferCertificates = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    'school_id',
    'class_id',
    'student_id',
    'appeared_year',
    'status',
    'created_by',
  ]);
  
  const paginationOptions = pick(req.query, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);

  const result = await TransferCertificateService.getAllTransferCertificates(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer certificates retrieved successfully',
    meta: result.meta as any,
    data: result.data,
  });
});

const getSingleTransferCertificate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransferCertificateService.getSingleTransferCertificate(Number(id));

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer certificate not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer certificate retrieved successfully',
    data: result,
  });
});

const updateTransferCertificate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = {
    ...req.body,
    updated_by: req.user?.id || null, // Set to null if no user
  };
  
  const result = await TransferCertificateService.updateTransferCertificate(
    Number(id),
    updateData
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer certificate not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer certificate updated successfully',
    data: result,
  });
});

const deleteTransferCertificate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransferCertificateService.deleteTransferCertificate(Number(id));

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer certificate not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer certificate deleted successfully',
    data: result,
  });
});

const softDeleteTransferCertificate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransferCertificateService.softDeleteTransferCertificate(Number(id));

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer certificate not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer certificate soft deleted successfully',
    data: result,
  });
});

const restoreTransferCertificate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransferCertificateService.restoreTransferCertificate(Number(id));

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer certificate not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer certificate restored successfully',
    data: result,
  });
});

const getTransferCertificatesByStudent = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const result = await TransferCertificateService.getTransferCertificatesByStudent(Number(studentId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student transfer certificates retrieved successfully',
    data: result,
  });
});

const getTransferCertificatesByClass = catchAsync(async (req: Request, res: Response) => {
  const { classId } = req.params;
  const result = await TransferCertificateService.getTransferCertificatesByClass(Number(classId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class transfer certificates retrieved successfully',
    data: result,
  });
});

export const TransferCertificateController = {
  createTransferCertificate,
  getAllTransferCertificates,
  getSingleTransferCertificate,
  updateTransferCertificate,
  deleteTransferCertificate,
  softDeleteTransferCertificate,
  restoreTransferCertificate,
  getTransferCertificatesByStudent,
  getTransferCertificatesByClass,
};
