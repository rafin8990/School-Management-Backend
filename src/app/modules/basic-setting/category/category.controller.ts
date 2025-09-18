import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../../constants/pagination';
import catchAsync from '../../../../shared/catchAsync';
import pick from '../../../../shared/pick';
import sendResponse from '../../../../shared/sendResponse';
import { ICategory } from './category.interface';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await CategoryService.createCategory(data);
  sendResponse<ICategory>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'name', 'status', 'school_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CategoryService.getAllCategories(filters, paginationOptions);

  sendResponse<ICategory[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
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

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getSingleCategory(Number(id));
  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await CategoryService.updateCategory(Number(id), data);
  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CategoryService.deleteCategory(Number(id));
  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully',
    data: null,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};


