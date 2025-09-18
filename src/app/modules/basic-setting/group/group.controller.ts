import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../../constants/pagination';
import catchAsync from '../../../../shared/catchAsync';
import pick from '../../../../shared/pick';
import sendResponse from '../../../../shared/sendResponse';
import { IGroup } from './group.interface';
import { GroupService } from './group.service';

const createGroup = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await GroupService.createGroup(data);
  sendResponse<IGroup>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Group created successfully',
    data: result,
  });
});

const getAllGroups = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'name', 'status', 'school_id']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await GroupService.getAllGroups(filters, paginationOptions);

  sendResponse<IGroup[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Groups retrieved successfully',
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

const getSingleGroup = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GroupService.getSingleGroup(Number(id));
  sendResponse<IGroup>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group retrieved successfully',
    data: result,
  });
});

const updateGroup = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await GroupService.updateGroup(Number(id), data);
  sendResponse<IGroup>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group updated successfully',
    data: result,
  });
});

const deleteGroup = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await GroupService.deleteGroup(Number(id));
  sendResponse<IGroup>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group deleted successfully',
    data: null,
  });
});

export const GroupController = {
  createGroup,
  getAllGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
};


