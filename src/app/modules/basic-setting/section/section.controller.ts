import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../../constants/pagination';
import catchAsync from '../../../../shared/catchAsync';
import pick from '../../../../shared/pick';
import sendResponse from '../../../../shared/sendResponse';
import { ISection } from './section.interface';
import { SectionService } from './section.service';

const createSection = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await SectionService.createSection(data);
  sendResponse<ISection>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Section created successfully',
    data: result,
  });
});

const getAllSections = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'name', 'status', 'school_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SectionService.getAllSections(filters, paginationOptions);

  sendResponse<ISection[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sections retrieved successfully',
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

const getSingleSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SectionService.getSingleSection(Number(id));
  sendResponse<ISection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Section retrieved successfully',
    data: result,
  });
});

const updateSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await SectionService.updateSection(Number(id), data);
  sendResponse<ISection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Section updated successfully',
    data: result,
  });
});

const deleteSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await SectionService.deleteSection(Number(id));
  sendResponse<ISection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Section deleted successfully',
    data: null,
  });
});

export const SectionController = {
  createSection,
  getAllSections,
  getSingleSection,
  updateSection,
  deleteSection,
};