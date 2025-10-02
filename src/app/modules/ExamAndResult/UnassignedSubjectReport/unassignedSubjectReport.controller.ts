import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import { UnassignedSubjectReportService } from './unassignedSubjectReport.service';
import sendResponse from '../../../../shared/sendResponse';
import { IUnassignedSubjectFilters } from './unassignedSubjectReport.interface';

const generateUnassignedSubjectReport = catchAsync(async (req: Request, res: Response) => {
  const filters: IUnassignedSubjectFilters = {
    class_id: req.body.class_id ? Number(req.body.class_id) : undefined,
    group_id: req.body.group_id ? Number(req.body.group_id) : undefined,
    section_id: req.body.section_id ? Number(req.body.section_id) : undefined,
    shift_id: req.body.shift_id ? Number(req.body.shift_id) : undefined,
    exam_id: Number(req.body.exam_id),
    year_id: Number(req.body.year_id),
    school_id: Number(req.body.school_id),
  };

  const result = await UnassignedSubjectReportService.generateUnassignedSubjectReport(filters);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unassigned subject report generated successfully',
    data: result,
  });
});

export const UnassignedSubjectReportController = {
  generateUnassignedSubjectReport,
};
