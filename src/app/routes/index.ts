import express from 'express';
import { DistrictRoutes } from '../modules/district/district.route';
import { ThanaRoutes } from '../modules/thana/thana.route';
import { SchoolRoutes } from '../modules/school/school.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ClassRoutes } from '../modules/basic-setting/class/class.route';
import { SectionRoutes } from '../modules/basic-setting/section/section.route';
import { GroupRoutes } from '../modules/basic-setting/group/group.route';
import { ShiftRoutes } from '../modules/basic-setting/shift/shift.route';
import { SubjectRoutes } from '../modules/basic-setting/subject/subject.route';
import { CategoryRoutes } from '../modules/basic-setting/category/category.route';
import { ClassExamRoutes } from '../modules/basic-setting/class-exam/classExam.route';
import { ClassGroupRoutes } from '../modules/basic-setting/class-group/classGroup.route';
import { ClassSectionRoutes } from '../modules/basic-setting/class-section/classSection.route';
import { ClassShiftRoutes } from '../modules/basic-setting/class-shift/classShift.route';
import { BoardExamRoutes } from '../modules/basic-setting/board-exam/boardExam.route';
import { DesignationRoutes } from '../modules/basic-setting/designation/designation.route';
import { DepartmentRoutes } from '../modules/basic-setting/department/department.route';
import { AcademicYearRoutes } from '../modules/basic-setting/academic-year/academicYear.route';
import { AcademicSessionRoutes } from '../modules/basic-setting/academic-session/academicSession.route';


const router = express.Router();

const moduleRoutes = [
 {
  path:'/districts',
  routes:DistrictRoutes
 },
 {
  path:'/thanas',
  routes:ThanaRoutes
 },
 {
  path:'/schools',
  routes:SchoolRoutes
 },
 {
  path:'/auth',
  routes:AuthRoutes
 },
 {
  path:'/basic-setting/classes',
  routes:ClassRoutes
 },
 {
  path:'/basic-setting/sections',
  routes:SectionRoutes
 },
 {
  path:'/basic-setting/groups',
  routes:GroupRoutes
 },
 {
  path:'/basic-setting/shifts',
  routes:ShiftRoutes
 },
 {
  path:'/basic-setting/subjects',
  routes:SubjectRoutes
 },
 {
  path:'/basic-setting/categories',
  routes:CategoryRoutes
 },
 {
  path:'/basic-setting/class-exams',
  routes:ClassExamRoutes
 },
 {
   path:'/basic-setting/class-groups',
   routes:ClassGroupRoutes
 },
 {
   path:'/basic-setting/class-sections',
   routes:ClassSectionRoutes
 },
 {
   path:'/basic-setting/class-shifts',
   routes:ClassShiftRoutes
 },
 {
   path:'/basic-setting/board-exams',
   routes:BoardExamRoutes
 },
 {
   path:'/basic-setting/designations',
   routes:DesignationRoutes
 },
 {
   path:'/basic-setting/departments',
   routes:DepartmentRoutes
 },
 {
   path:'/basic-setting/academic-years',
   routes:AcademicYearRoutes
 },
 {
   path:'/basic-setting/academic-sessions',
   routes:AcademicSessionRoutes
 }
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
