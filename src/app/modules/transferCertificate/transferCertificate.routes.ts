import express from 'express';
import { TransferCertificateController } from './transferCertificate.controller';
import { createTransferCertificateValidationSchema, updateTransferCertificateValidationSchema, transferCertificateQueryValidationSchema, transferCertificateParamsValidationSchema } from './transferCertificate.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// Create transfer certificate
router.post(
  '/',
  validateRequest(createTransferCertificateValidationSchema),
  TransferCertificateController.createTransferCertificate
);

// Get all transfer certificates with pagination and filtering
router.get(
  '/',
  validateRequest(transferCertificateQueryValidationSchema),
  TransferCertificateController.getAllTransferCertificates
);

// Get single transfer certificate
router.get(
  '/:id',
  validateRequest(transferCertificateParamsValidationSchema),
  TransferCertificateController.getSingleTransferCertificate
);

// Update transfer certificate
router.patch(
  '/:id',
  validateRequest(updateTransferCertificateValidationSchema),
  TransferCertificateController.updateTransferCertificate
);

// Delete transfer certificate (hard delete)
router.delete(
  '/:id',
  validateRequest(transferCertificateParamsValidationSchema),
  TransferCertificateController.deleteTransferCertificate
);

// Soft delete transfer certificate
router.patch(
  '/:id/soft-delete',
  validateRequest(transferCertificateParamsValidationSchema),
  TransferCertificateController.softDeleteTransferCertificate
);

// Restore transfer certificate
router.patch(
  '/:id/restore',
  validateRequest(transferCertificateParamsValidationSchema),
  TransferCertificateController.restoreTransferCertificate
);

// Get transfer certificates by student
router.get(
  '/student/:studentId',
  TransferCertificateController.getTransferCertificatesByStudent
);

// Get transfer certificates by class
router.get(
  '/class/:classId',
  TransferCertificateController.getTransferCertificatesByClass
);

export const TransferCertificateRoutes = router;
