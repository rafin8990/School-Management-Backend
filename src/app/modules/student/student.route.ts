import { Router } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import multer from 'multer';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post(
  '/',
  validateRequest(StudentValidation.createStudentZodSchema),
  StudentController.createStudent
);

router.post(
  '/bulk-create',
  validateRequest(StudentValidation.bulkCreateStudentsZodSchema),
  StudentController.bulkCreateStudents
);

router.get(
  '/',
  validateRequest(StudentValidation.getAllStudentsZodSchema),
  StudentController.getAllStudents
);

router.get(
  '/generate-student-id',
  validateRequest(StudentValidation.generateStudentIdZodSchema),
  StudentController.generateStudentId
);

router.get(
  '/classes-with-assignments',
  validateRequest(StudentValidation.getClassesWithAssignmentsZodSchema),
  StudentController.getClassesWithAssignments
);

// Excel import
router.post(
  '/import-excel',
  upload.single('file'),
  StudentController.importStudentsFromExcel
);

// Migration endpoints
router.post(
  '/migration/search',
  StudentController.searchStudentsForMigration
);

router.post(
  '/migration',
  StudentController.migrateStudents
);

router.get(
  '/:id',
  validateRequest(StudentValidation.getSingleStudentZodSchema),
  StudentController.getSingleStudent
);

// Handle preflight OPTIONS request for bulk update
router.options('/bulk', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-School-Id, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});

router.patch(
  '/bulk',
  StudentController.bulkUpdateStudents
);

router.patch(
  '/:id',
  StudentController.updateStudent
);

router.delete(
  '/:id',
  validateRequest(StudentValidation.deleteStudentZodSchema),
  StudentController.deleteStudent
);



export const StudentRoutes = router;
