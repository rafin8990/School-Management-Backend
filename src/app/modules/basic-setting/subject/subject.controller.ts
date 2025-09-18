import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../../constants/pagination';
import catchAsync from '../../../../shared/catchAsync';
import pick from '../../../../shared/pick';
import sendResponse from '../../../../shared/sendResponse';
import { ISubject } from './subject.interface';
import { SubjectService } from './subject.service';

const createSubject = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await SubjectService.createSubject(data);
  sendResponse<ISubject>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Subject created successfully',
    data: result,
  });
});

const getAllSubjects = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'name', 'status', 'school_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SubjectService.getAllSubjects(filters, paginationOptions);

  sendResponse<ISubject[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subjects retrieved successfully',
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

const getSingleSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubjectService.getSingleSubject(Number(id));
  sendResponse<ISubject>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subject retrieved successfully',
    data: result,
  });
});

const updateSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await SubjectService.updateSubject(Number(id), data);
  sendResponse<ISubject>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subject updated successfully',
    data: result,
  });
});

const deleteSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await SubjectService.deleteSubject(Number(id));
  sendResponse<ISubject>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subject deleted successfully',
    data: null,
  });
});

export const SubjectController = {
  createSubject,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
};


