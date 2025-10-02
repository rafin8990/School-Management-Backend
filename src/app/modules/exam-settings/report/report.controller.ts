import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { ReportService } from './report.service';
import { IReport } from './report.interface';

const create = catchAsync(async (req, res) => {
  const data = req.body as IReport;
  const result = await ReportService.create(data);
  sendResponse(res, { 
    statusCode: httpStatus.CREATED, 
    success: true, 
    message: 'Report created successfully', 
    data: result 
  });
});

const getAll = catchAsync(async (req, res) => {
  const schoolId = Number(req.query.school_id);
  const status = req.query.status as 'active'|'inactive'|undefined;
  const result = await ReportService.getAll(schoolId, status);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Reports fetched successfully', 
    data: result 
  });
});

const getById = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const schoolId = Number(req.query.school_id);
  const result = await ReportService.getById(id, schoolId);
  if (!result) {
    return sendResponse(res, { 
      statusCode: httpStatus.NOT_FOUND, 
      success: false, 
      message: 'Report not found', 
      data: null 
    });
  }
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Report fetched successfully', 
    data: result 
  });
});

const update = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body as Partial<IReport>;
  const result = await ReportService.update(id, data);
  if (!result) {
    return sendResponse(res, { 
      statusCode: httpStatus.NOT_FOUND, 
      success: false, 
      message: 'Report not found', 
      data: null 
    });
  }
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Report updated successfully', 
    data: result 
  });
});

const remove = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  await ReportService.remove(id);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Report deleted successfully', 
    data: null 
  });
});

export const ReportController = { create, getAll, getById, update, remove };
