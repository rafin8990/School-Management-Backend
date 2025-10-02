import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { GradeSetupService } from './grade-setup.service';
import { IGradeSetup, IGradePointSetup } from './grade-setup.interface';

const create = catchAsync(async (req, res) => {
  const data = req.body as IGradeSetup;
  const result = await GradeSetupService.create(data);
  sendResponse(res, { 
    statusCode: httpStatus.CREATED, 
    success: true, 
    message: 'Grade setup created successfully', 
    data: result 
  });
});

const getByExamAndYear = catchAsync(async (req, res) => {
  const examId = Number(req.query.exam_id);
  const yearId = req.query.year_id ? Number(req.query.year_id) : null;
  const schoolId = Number(req.query.school_id);
  
  const result = await GradeSetupService.getByExamAndYear(examId, yearId, schoolId);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade setups fetched successfully', 
    data: result 
  });
});

const getById = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const schoolId = Number(req.query.school_id);
  const result = await GradeSetupService.getById(id, schoolId);
  if (!result) {
    return sendResponse(res, { 
      statusCode: httpStatus.NOT_FOUND, 
      success: false, 
      message: 'Grade setup not found', 
      data: null 
    });
  }
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade setup fetched successfully', 
    data: result 
  });
});

const update = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body as Partial<IGradeSetup>;
  const result = await GradeSetupService.update(id, data);
  if (!result) {
    return sendResponse(res, { 
      statusCode: httpStatus.NOT_FOUND, 
      success: false, 
      message: 'Grade setup not found', 
      data: null 
    });
  }
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade setup updated successfully', 
    data: result 
  });
});

const remove = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  await GradeSetupService.remove(id);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade setup deleted successfully', 
    data: null 
  });
});

const upsertGradeSetup = catchAsync(async (req, res) => {
  const { exam_id, year_id, class_ids, school_id } = req.body;
  const result = await GradeSetupService.upsertGradeSetup(exam_id, year_id, class_ids, school_id);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade setups upserted successfully', 
    data: result 
  });
});

// Grade Point Setup controllers
const createGradePoint = catchAsync(async (req, res) => {
  const data = req.body as IGradePointSetup;
  const result = await GradeSetupService.createGradePoint(data);
  sendResponse(res, { 
    statusCode: httpStatus.CREATED, 
    success: true, 
    message: 'Grade point created successfully', 
    data: result 
  });
});

const getGradePointsBySetupId = catchAsync(async (req, res) => {
  const gradeSetupId = Number(req.params.gradeSetupId);
  const result = await GradeSetupService.getGradePointsBySetupId(gradeSetupId);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade points fetched successfully', 
    data: result 
  });
});

const updateGradePoint = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body as Partial<IGradePointSetup>;
  const result = await GradeSetupService.updateGradePoint(id, data);
  if (!result) {
    return sendResponse(res, { 
      statusCode: httpStatus.NOT_FOUND, 
      success: false, 
      message: 'Grade point not found', 
      data: null 
    });
  }
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade point updated successfully', 
    data: result 
  });
});

const deleteGradePoint = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  await GradeSetupService.deleteGradePoint(id);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade point deleted successfully', 
    data: null 
  });
});

const bulkUpsertGradePoints = catchAsync(async (req, res) => {
  const { grade_setup_id, grade_points } = req.body;
  const result = await GradeSetupService.bulkUpsertGradePoints(grade_setup_id, grade_points);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade points upserted successfully', 
    data: result 
  });
});

export const GradeSetupController = { 
  create, 
  getByExamAndYear, 
  getById, 
  update, 
  remove, 
  upsertGradeSetup,
  createGradePoint,
  getGradePointsBySetupId,
  updateGradePoint,
  deleteGradePoint,
  bulkUpsertGradePoints
};
