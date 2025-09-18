import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../../constants/pagination';
import catchAsync from '../../../../shared/catchAsync';
import pick from '../../../../shared/pick';
import sendResponse from '../../../../shared/sendResponse';
import { IShift } from './shift.interface';
import { ShiftService } from './shift.service';

const createShift = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await ShiftService.createShift(data);
  sendResponse<IShift>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Shift created successfully',
    data: result,
  });
});

const getAllShifts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'name', 'status', 'school_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ShiftService.getAllShifts(filters, paginationOptions);

  sendResponse<IShift[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shifts retrieved successfully',
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

const getSingleShift = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ShiftService.getSingleShift(Number(id));
  sendResponse<IShift>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shift retrieved successfully',
    data: result,
  });
});

const updateShift = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ShiftService.updateShift(Number(id), data);
  sendResponse<IShift>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shift updated successfully',
    data: result,
  });
});

const deleteShift = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ShiftService.deleteShift(Number(id));
  sendResponse<IShift>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shift deleted successfully',
    data: null,
  });
});

export const ShiftController = {
  createShift,
  getAllShifts,
  getSingleShift,
  updateShift,
  deleteShift,
};


