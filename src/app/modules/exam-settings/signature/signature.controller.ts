import httpStatus from 'http-status';
import sendResponse from '../../../../shared/sendResponse';
import catchAsync from '../../../../shared/catchAsync';
import { SignatureService } from './signature.service';
import { ISignature } from './signature.interface';

const create = catchAsync(async (req, res) => {
  const data = req.body as ISignature;
  const result = await SignatureService.create(data);
  sendResponse(res, { 
    statusCode: httpStatus.CREATED, 
    success: true, 
    message: 'Signature created successfully', 
    data: result 
  });
});

const getAll = catchAsync(async (req, res) => {
  const schoolId = Number(req.query.school_id);
  const status = req.query.status as 'active'|'inactive'|undefined;
  const result = await SignatureService.getAll(schoolId, status);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Signatures fetched successfully', 
    data: result 
  });
});

const getById = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const schoolId = Number(req.query.school_id);
  const result = await SignatureService.getById(id, schoolId);
  if (!result) {
    return sendResponse(res, { 
      statusCode: httpStatus.NOT_FOUND, 
      success: false, 
      message: 'Signature not found', 
      data: null 
    });
  }
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Signature fetched successfully', 
    data: result 
  });
});

const update = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body as Partial<ISignature>;
  const result = await SignatureService.update(id, data);
  if (!result) {
    return sendResponse(res, { 
      statusCode: httpStatus.NOT_FOUND, 
      success: false, 
      message: 'Signature not found', 
      data: null 
    });
  }
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Signature updated successfully', 
    data: result 
  });
});

const remove = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  await SignatureService.remove(id);
  sendResponse(res, { 
    statusCode: httpStatus.OK, 
    success: true, 
    message: 'Signature deleted successfully', 
    data: null 
  });
});

export const SignatureController = { create, getAll, getById, update, remove };
