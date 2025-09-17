import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IThana } from './thana.interface';
import { ThanaService } from './thana.service';

const createThana = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await ThanaService.createThana(data);
  sendResponse<IThana>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Thana created successfully',
    data: result,
  });
});

const getAllThanas = catchAsync(async (req: Request, res: Response) => {
  const rawFilters = pick(req.query, ['searchTerm', 'name', 'district_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ThanaService.getAllThanas(
    rawFilters,
    paginationOptions
  );

  const paginationMeta = result.meta
    ? {
        page: result.meta.page ?? 1,
        limit: result.meta.limit ?? 10,
        total: result.meta.total ?? 0,
        ...paginationHelpers.calculatePaginationMetadata(
          result.meta.page ?? 1,
          result.meta.limit ?? 10,
          result.meta.total ?? 0
        ),
      }
    : undefined;

  sendResponse<IThana[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Thanas retrieved successfully',
    meta: paginationMeta,
    data: result.data,
  });
});

const getSingleThana = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ThanaService.getSingleThana(Number(id));
  sendResponse<IThana>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Thana retrieved successfully',
    data: result,
  });
});

const updateThana = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ThanaService.updateThana(Number(id), data);
  sendResponse<IThana>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Thana updated successfully',
    data: result,
  });
});

const deleteThana = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ThanaService.deleteThana(Number(id));
  sendResponse<IThana>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Thana deleted successfully',
    data: null,
  });
});

const getThanasByDistrict = catchAsync(async (req: Request, res: Response) => {
  const { districtId } = req.params;
  const result = await ThanaService.getThanasByDistrict(Number(districtId));
  sendResponse<IThana[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Thanas retrieved successfully by district',
    data: result,
  });
});

export const ThanaController = {
  createThana,
  getAllThanas,
  getSingleThana,
  updateThana,
  deleteThana,
  getThanasByDistrict,
};


