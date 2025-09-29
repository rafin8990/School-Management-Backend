import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { SetExamMarksService } from './setExamMarks.service';

const search = catchAsync(async (req, res) => {
  const schoolId = Number(req.query.school_id);
  const classId = Number(req.query.class_id);
  const yearId = Number(req.query.year_id);
  const classExamIds = (req.query.class_exam_ids as string | undefined)?.split(',').map(Number).filter(n => !isNaN(n)) || [];
  const result = await SetExamMarksService.listSubjectsAndExisting(schoolId, classId, yearId, classExamIds);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Data fetched', data: result });
});

const upsert = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await SetExamMarksService.upsert(payload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Marks saved', data: result });
});

export const SetExamMarksController = { search, upsert };


