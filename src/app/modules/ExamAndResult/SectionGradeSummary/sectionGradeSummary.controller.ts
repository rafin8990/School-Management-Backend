import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { SectionGradeSummaryService } from './sectionGradeSummary.service';

const generate = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    class_id: req.body.class_id ? Number(req.body.class_id) : undefined,
    group_id: req.body.group_id ? Number(req.body.group_id) : undefined,
    section_id: req.body.section_id ? Number(req.body.section_id) : undefined,
    exam_id: Number(req.body.exam_id),
    year_id: Number(req.body.year_id),
    school_id: Number(req.body.school_id),
  };
  const data = await SectionGradeSummaryService.generate(payload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Section grade summary generated successfully', data });
});

export const SectionGradeSummaryController = { generate };


