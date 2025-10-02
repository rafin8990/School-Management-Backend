import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { ExamPublishService } from './examPublish.service';
import { IExamPublish } from './examPublish.interface';

const upsert = catchAsync(async (req, res) => {
  const payload = req.body as IExamPublish;
  const result = await ExamPublishService.upsert(payload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Exam publish status saved', data: result });
});

const get = catchAsync(async (req, res) => {
  const schoolId = Number(req.query.school_id);
  const examId = Number(req.query.exam_id);
  const yearId = Number(req.query.year_id);
  const result = await ExamPublishService.get(schoolId, examId, yearId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Exam publish status fetched', data: result });
});

export const ExamPublishController = { upsert, get };


