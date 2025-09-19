import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

export const AuthController = {
  register: catchAsync(async (req, res) => {
    const result = await AuthService.registerUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User created successfully',
      data: result,
    });
  }),

  login: catchAsync(async (req, res) => {
    const result = await AuthService.loginUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Login successful',
      data: result,
    });
  }),

  logout: catchAsync(async (_req, res) => {
    // For stateless JWT, logout is handled client-side. This endpoint exists for future blacklisting.
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Logout successful',
      data: null,
    });
  }),

  getLoggedInUser: catchAsync(async (req, res) => {
    const result = await AuthService.getLoggedInUser(req.user!.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User retrieved successfully',
      data: result,
    });
  }),
};


