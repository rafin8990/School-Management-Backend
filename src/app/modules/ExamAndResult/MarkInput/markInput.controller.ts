import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import { MarkInputService } from './markInput.service';
import sendResponse from '../../../../shared/sendResponse';
import pick from '../../../../shared/pick';
import { paginationFields } from '../../../../constants/pagination';


const createMarkInput = catchAsync(async (req: Request, res: Response) => {
  const result = await MarkInputService.saveMarkInput(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mark input created successfully',
    data: result,
  });
});

const searchStudentsForMarkInput = catchAsync(async (req: Request, res: Response) => {
  const result = await MarkInputService.searchStudentsForMarkInput(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully',
    data: result,
  });
});

const saveMarkInput = catchAsync(async (req: Request, res: Response) => {
  const result = await MarkInputService.saveMarkInput(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mark input saved successfully',
    data: result,
  });
});

const getAllMarkInputs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    'student_id',
    'class_id',
    'group_id',
    'section_id',
    'shift_id',
    'subject_id',
    'exam_id',
    'year_id',
    'status',
    'school_id',
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await MarkInputService.getAllMarkInputs(filters, paginationOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mark inputs retrieved successfully',
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

const getSingleMarkInput = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MarkInputService.getSingleMarkInput(Number(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mark input retrieved successfully',
    data: result,
  });
});

const updateMarkInput = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MarkInputService.saveMarkInput({
    ...req.body,
    id: Number(id),
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mark input updated successfully',
    data: result,
  });
});

const deleteMarkInput = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await MarkInputService.deleteMarkInput(Number(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mark input deleted successfully',
  });
});

const bulkUploadMarkInput = catchAsync(async (req: Request, res: Response) => {
  const result = await MarkInputService.bulkUploadMarkInput(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Marks uploaded successfully',
    data: result,
  });
});

const deleteMarkInputBySubjectWise = catchAsync(async (req: Request, res: Response) => {
  const result = await MarkInputService.deleteMarkInputBySubjectWise(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const MarkInputController = {
  createMarkInput,
  searchStudentsForMarkInput,
  saveMarkInput,
  getAllMarkInputs,
  getSingleMarkInput,
  updateMarkInput,
  deleteMarkInput,
  bulkUploadMarkInput,
  deleteMarkInputBySubjectWise,
};
