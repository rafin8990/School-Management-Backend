import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { GradeService } from './grade.service';
import { IGrade } from './grade.interface';

const create = catchAsync(async (req, res) => {
  const data = req.body as IGrade;
  const result = await GradeService.create(data);
  sendResponse(res, { 
    statusCode: httpStatus.CREATED, 
    success: true, 
    message: 'Grade created successfully', 
    data: result 
  });
});

const getAll = catchAsync(async (req, res) => {
  const schoolId = Number(req.query.school_id);
  const status = req.query.status as 'active'|'inactive'|undefined;
  const result = await GradeService.getAll(schoolId, status);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grades fetched successfully', 
    data: result 
  });
});

const getById = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const schoolId = Number(req.query.school_id);
  const result = await GradeService.getById(id, schoolId);
  if (!result) {
    return sendResponse(res, { 
      statusCode: httpStatus.NOT_FOUND, 
      success: false, 
      message: 'Grade not found', 
      data: null 
    });
  }
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade fetched successfully', 
    data: result 
  });
});

const update = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body as Partial<IGrade>;
  const result = await GradeService.update(id, data);
  if (!result) {
    return sendResponse(res, { 
      statusCode: httpStatus.NOT_FOUND, 
      success: false, 
      message: 'Grade not found', 
      data: null 
    });
  }
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade updated successfully', 
    data: result 
  });
});

const remove = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  await GradeService.remove(id);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grade deleted successfully', 
    data: null 
  });
});

const bulkCreate = catchAsync(async (req, res) => {
  const grades = req.body as IGrade[];
  const result = await GradeService.bulkCreate(grades);
  sendResponse(res, { 
    statusCode: httpStatus.CREATED, 
    success: true, 
    message: 'Grades created successfully', 
    data: result 
  });
});

const bulkUpdate = catchAsync(async (req, res) => {
  const grades = req.body as Partial<IGrade>[];
  const result = await GradeService.bulkUpdate(grades);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Grades updated successfully', 
    data: result 
  });
});

export const GradeController = { 
  create, 
  getAll, 
  getById, 
  update, 
  remove, 
  bulkCreate, 
  bulkUpdate 
};
