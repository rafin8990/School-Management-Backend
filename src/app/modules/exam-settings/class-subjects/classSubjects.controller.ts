import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { IAssignmentInput } from './classSubjects.interface';
import { ClassSubjectsService } from './classSubjects.service';

const assignSubjects = catchAsync(async (req, res) => {
  const payload = req.body as IAssignmentInput;
  const result = await ClassSubjectsService.assignSubjects(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subjects assigned successfully',
    data: result,
  });
});

const getAssignments = catchAsync(async (req, res) => {
  const { school_id, class_id, group_id } = req.query as any;
  const result = await ClassSubjectsService.getAssignments(
    Number(school_id),
    Number(class_id),
    Number(group_id)
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignments fetched successfully',
    data: result,
  });
});

export const ClassSubjectsController = {
  assignSubjects,
  getAssignments,
};


