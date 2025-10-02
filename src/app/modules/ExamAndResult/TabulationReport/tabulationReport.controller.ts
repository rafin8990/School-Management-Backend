import { Request, Response } from 'express';
import { tabulationReportService } from './tabulationReport.service';
import { tabulationFormat2Service } from './tabulationFormat2.service';
import tabulationFormat3Service from './tabulationFormat3.service';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';


const getTabulationReport = catchAsync(async (req: Request, res: Response) => {
  const result = await tabulationReportService.getTabulationReport(req.body);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tabulation report retrieved successfully',
    data: result,
  });
});

const getTabulationFormat2Report = catchAsync(async (req: Request, res: Response) => {
  const result = await tabulationFormat2Service.getTabulationFormat2Report(req.body);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tabulation Format 2 report retrieved successfully',
    data: result,
  });
});

const getTabulationFormat3Report = catchAsync(async (req: Request, res: Response) => {
  const result = await tabulationFormat3Service.getTabulationFormat3Report(req.body);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tabulation Format 3 report retrieved successfully',
    data: result,
  });
});

export const tabulationReportController = {
  getTabulationReport,
  getTabulationFormat2Report,
  getTabulationFormat3Report,
};
