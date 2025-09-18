import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { SchoolService } from './school.service';
import { ISchool } from './school.interface';

const createSchool = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await SchoolService.createSchool(data);
  sendResponse<ISchool>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'School created successfully',
    data: result,
  });
});

const getAllSchools = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'name', 'eiin', 'district_id', 'thana_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SchoolService.getAllSchools(filters, paginationOptions);

  sendResponse<ISchool[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schools retrieved successfully',
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

const getSingleSchool = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SchoolService.getSingleSchool(Number(id));
  sendResponse<ISchool>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'School retrieved successfully',
    data: result,
  });
});

const updateSchool = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await SchoolService.updateSchool(Number(id), data);
  sendResponse<ISchool>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'School updated successfully',
    data: result,
  });
});

const deleteSchool = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await SchoolService.deleteSchool(Number(id));
  sendResponse<ISchool>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'School deleted successfully',
    data: null,
  });
});

const getSchoolsByDistrict = catchAsync(async (req: Request, res: Response) => {
  const { districtId } = req.params;
  const result = await SchoolService.getSchoolsByDistrict(Number(districtId));
  sendResponse<ISchool[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schools retrieved successfully by district',
    data: result,
  });
});

const getSchoolsByThana = catchAsync(async (req: Request, res: Response) => {
  const { thanaId } = req.params;
  const result = await SchoolService.getSchoolsByThana(Number(thanaId));
  sendResponse<ISchool[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schools retrieved successfully by thana',
    data: result,
  });
});

export const SchoolController = {
  createSchool,
  getAllSchools,
  getSingleSchool,
  updateSchool,
  deleteSchool,
  getSchoolsByDistrict,
  getSchoolsByThana,
};
