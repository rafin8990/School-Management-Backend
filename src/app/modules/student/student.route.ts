import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = Router();

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
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudent
);

router.delete(
  '/:id',
  validateRequest(StudentValidation.deleteStudentZodSchema),
  StudentController.deleteStudent
);



export const StudentRoutes = router;
