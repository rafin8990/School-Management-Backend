import { Request,Response,NextFunction, Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = Router();

router.post(
  '/',
  validateRequest(StudentValidation.createStudentZodSchema),
  StudentController.createStudent
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

router.patch(
  '/:id',
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudent
);

router.patch(
  '/bulk',
  StudentController.bulkUpdateStudents
);

router.delete(
  '/:id',
  validateRequest(StudentValidation.deleteStudentZodSchema),
  StudentController.deleteStudent
);



export const StudentRoutes = router;
