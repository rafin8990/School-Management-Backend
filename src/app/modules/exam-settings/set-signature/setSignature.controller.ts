import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { SetSignatureService } from './setSignature.service';

const listByReport = catchAsync(async (req, res) => {
  const schoolId = Number(req.query.school_id);
  const reportId = Number(req.query.report_id);
  const result = await SetSignatureService.listByReport(schoolId, reportId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Signatures fetched', data: result });
});

const upsertMany = catchAsync(async (req, res) => {
  const schoolId = Number(req.body.school_id);
  const reportId = Number(req.body.report_id);
  const rows = req.body.rows;
  const result = await SetSignatureService.upsertMany(schoolId, reportId, rows);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Signatures saved', data: result });
});

export const SetSignatureController = { listByReport, upsertMany };


