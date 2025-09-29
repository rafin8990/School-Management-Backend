import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { ShortCodeService } from './shortCode.service';
import { IShortCode } from './shortCode.interface';

const create = catchAsync(async (req, res) => {
  const data = req.body as IShortCode;
  const result = await ShortCodeService.create(data);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Short code created', data: result });
});

const getAll = catchAsync(async (req, res) => {
  const schoolId = Number(req.query.school_id);
  const status = req.query.status as 'active'|'inactive'|undefined;
  const result = await ShortCodeService.getAll(schoolId, status);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Short codes fetched', data: result });
});

const update = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body as Partial<IShortCode>;
  const result = await ShortCodeService.update(id, data);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Short code updated', data: result });
});

const remove = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  await ShortCodeService.remove(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Short code deleted', data: null });
});

export const ShortCodeController = { create, getAll, update, remove };


