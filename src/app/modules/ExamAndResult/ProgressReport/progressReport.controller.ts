import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { ProgressReportService } from './progressReport.service';
import { IProgressReportFilters } from './progressReport.interface';

const generateProgressReport = catchAsync(async (req, res) => {
  const filters = req.body as IProgressReportFilters;
  const result = await ProgressReportService.generateProgressReport(filters);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Progress report generated successfully',
    data: result,
  });
});

const getStudentsForProgressReport = catchAsync(async (req, res) => {
  const filters = req.body as Omit<IProgressReportFilters, 'student_id'>;
  const result = await ProgressReportService.getStudentsForProgressReport(filters);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students fetched successfully',
    data: result,
  });
});

const getGradeSetupForProgressReport = catchAsync(async (req, res) => {
  const classId = Number(req.query.class_id);
  const examId = Number(req.query.exam_id);
  const yearId = Number(req.query.year_id);
  const schoolId = Number(req.query.school_id);
  
  const result = await ProgressReportService.getGradeSetupForProgressReport(classId, examId, yearId, schoolId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Grade setup fetched successfully',
    data: result,
  });
});

const getSequentialExamOrder = catchAsync(async (req, res) => {
  const classId = Number(req.query.class_id);
  const examId = Number(req.query.exam_id);
  const schoolId = Number(req.query.school_id);
  
  const result = await ProgressReportService.getSequentialExamOrder(classId, examId, schoolId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sequential exam order fetched successfully',
    data: result,
  });
});

const getProgressReportById = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const schoolId = Number(req.query.school_id);
  
  // This would typically fetch a saved report from database
  // For now, return a placeholder response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Progress report fetched successfully',
    data: null,
  });
});

export const ProgressReportController = {
  generateProgressReport,
  getStudentsForProgressReport,
  getGradeSetupForProgressReport,
  getSequentialExamOrder,
  getProgressReportById,
};
