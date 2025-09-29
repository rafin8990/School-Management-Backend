import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { FourthSubjectService } from './fourthSubject.service';

const listSubjects = catchAsync(async (req, res) => {
  const { school_id, class_id } = req.query as any;
  const data = await FourthSubjectService.listChoosableSubjectsByClass(Number(school_id), Number(class_id));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Subjects fetched', data });
});

const listStudents = catchAsync(async (req, res) => {
  const { school_id, class_id, group_id, section_id, year_id } = req.query as any;
  const data = await FourthSubjectService.listStudents(Number(school_id), Number(class_id), group_id ? Number(group_id) : null, section_id ? Number(section_id) : null, Number(year_id));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Students fetched', data });
});

const assign = catchAsync(async (req, res) => {
  const { school_id, subject_id, student_ids } = req.body as any;
  const data = await FourthSubjectService.assignFourthSubject(Number(school_id), Number(subject_id), student_ids as number[]);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Assigned', data });
});

export const FourthSubjectController = { listSubjects, listStudents, assign };

export const listAssignments = catchAsync(async (req, res) => {
  const { school_id, class_id, group_id, section_id, year_id } = req.query as any;
  const data = await (await import('./fourthSubject.service')).listAssignments(
    Number(school_id),
    Number(class_id),
    group_id ? Number(group_id) : null,
    section_id ? Number(section_id) : null,
    Number(year_id)
  );
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Assignments fetched', data });
});


