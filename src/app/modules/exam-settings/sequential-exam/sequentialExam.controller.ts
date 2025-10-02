import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { SequentialExamService } from './sequentialExam.service';
import { ISequentialExam } from './sequentialExam.interface';

const listByClassAndExam = catchAsync(async (req, res) => {
  const schoolId = Number(req.query.school_id);
  const classId = Number(req.query.class_id);
  const examId = Number(req.query.exam_id);
  const result = await SequentialExamService.listByClassAndExam(schoolId, classId, examId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Sequential settings fetched', data: result });
});

const upsert = catchAsync(async (req, res) => {
  const payload = req.body as ISequentialExam;
  const result = await SequentialExamService.upsert(payload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Sequential setting saved', data: result });
});

export const SequentialExamController = { listByClassAndExam, upsert };


