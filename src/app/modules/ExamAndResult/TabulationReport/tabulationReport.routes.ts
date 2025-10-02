import { Router } from 'express';
import { tabulationReportController } from './tabulationReport.controller';

const router = Router();

router.post('/tabulation-report', tabulationReportController.getTabulationReport);
router.post('/tabulation-format2-report', tabulationReportController.getTabulationFormat2Report);
router.post('/tabulation-format3-report', tabulationReportController.getTabulationFormat3Report);

export const tabulationReportRoutes = router;
