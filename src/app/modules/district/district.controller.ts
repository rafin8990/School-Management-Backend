import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IDistrict } from './district.interface';
import { DistrictService } from './district.service';

const createDistrict = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await DistrictService.createDistrict(data);
  sendResponse<IDistrict>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'District created successfully',
    data: result,
  });
});

const getAllDistricts = catchAsync(async (req: Request, res: Response) => {
  const rawFilters = pick(req.query, ['searchTerm', 'name']);
  const paginationOptions = pick(req.query, paginationFields);


  const result = await DistrictService.getAllDistricts(
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

  sendResponse<IDistrict[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Districts retrieved successfully',
    meta: paginationMeta,
    data: result.data,
  });
});

const getSingleDistrict = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DistrictService.getSingleDistrict(Number(id));
  sendResponse<IDistrict>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'District retrieved successfully',
    data: result,
  });
});

const updateDistrict = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await DistrictService.updateDistrict(Number(id), data);
  sendResponse<IDistrict>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'District updated successfully',
    data: result,
  });
});

const deleteDistrict = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await DistrictService.deleteDistrict(Number(id));
  sendResponse<IDistrict>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'District deleted successfully',
    data: null,
  });
});

export const DistrictController = {
  createDistrict,
  getAllDistricts,
  getSingleDistrict,
  updateDistrict,
  deleteDistrict,
};


