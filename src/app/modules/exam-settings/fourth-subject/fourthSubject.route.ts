import express from 'express';
import { FourthSubjectController, listAssignments } from './fourthSubject.controller';

const router = express.Router();

router.get('/subjects', FourthSubjectController.listSubjects);
router.get('/students', FourthSubjectController.listStudents);
router.post('/assign', FourthSubjectController.assign);
router.get('/assignments', listAssignments);

export const FourthSubjectRoutes = router;


