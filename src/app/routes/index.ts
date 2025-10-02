import express from 'express';
import { DistrictRoutes } from '../modules/district/district.route';
import { ThanaRoutes } from '../modules/thana/thana.route';
import { SchoolRoutes } from '../modules/school/school.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ClassRoutes } from '../modules/basic-setting/class/class.route';
import { SectionRoutes } from '../modules/basic-setting/section/section.route';
import { GroupRoutes } from '../modules/basic-setting/group/group.route';
import { ShiftRoutes } from '../modules/basic-setting/shift/shift.route';
import { ClassAssignmentRoutes } from '../modules/basic-setting/class-assignment/class-assignment.route';
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
import ClassPeriodRoutes from '../modules/basic-setting/class-period/classPeriod.route';
import { StudentRoutes } from '../modules/student/student.route';
import { TransferCertificateRoutes } from '../modules/transferCertificate/transferCertificate.routes';
import { ClassSubjectsRoutes } from '../modules/exam-settings/class-subjects/classSubjects.route';
import { ShortCodeRoutes } from '../modules/exam-settings/short-code/shortCode.route';
import { SetExamMarksRoutes } from '../modules/exam-settings/set-exam-marks/setExamMarks.route';
import { FourthSubjectRoutes } from '../modules/exam-settings/fourth-subject/fourthSubject.route';
import { ReportRoutes } from '../modules/exam-settings/report/report.route';
import { SignatureRoutes } from '../modules/exam-settings/signature/signature.route';
import { GradeRoutes } from '../modules/exam-settings/grade/grade.route';
import { GradeSetupRoutes } from '../modules/exam-settings/grade-setup/grade-setup.route';
import { SetSignatureRoutes } from '../modules/exam-settings/set-signature/setSignature.route';
import { ExamPublishRoutes } from '../modules/exam-settings/exam-publish/examPublish.route';
import { SequentialExamRoutes } from '../modules/exam-settings/sequential-exam/sequentialExam.route';
import { MarkInputRoutes } from '../modules/ExamAndResult/MarkInput/markInput.route';
import { ProgressReportRoutes } from '../modules/ExamAndResult/ProgressReport/progressReport.route';
import { UnassignedSubjectReportRoutes } from '../modules/ExamAndResult/UnassignedSubjectReport/unassignedSubjectReport.route';
import { SubjectSummaryRoutes } from '../modules/ExamAndResult/SubjectPassFailSummary/subjectSummary.route';
import { SectionGradeSummaryRoutes } from '../modules/ExamAndResult/SectionGradeSummary/sectionGradeSummary.route';
import { tabulationReportRoutes } from '../modules/ExamAndResult/TabulationReport/tabulationReport.routes';
import { PassFailPercentageRoutes } from '../modules/ExamAndResult/PassFailPercentageReport/passFailPercentage.route';


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
   path:'/basic-setting/class-assignments',
   routes:ClassAssignmentRoutes
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
 },
 {
   path:'/basic-setting/class-periods',
   routes:ClassPeriodRoutes
 },
 {
   path:'/students',
   routes:StudentRoutes
 },
 {
   path:'/transfer-certificates',
   routes:TransferCertificateRoutes
 },
 {
   path:'/exam-settings/short-codes',
   routes:ShortCodeRoutes
 },
 {
   path:'/exam-settings/set-exam-marks',
   routes:SetExamMarksRoutes
 },
 {
   path:'/exam-settings/fourth-subject',
   routes:FourthSubjectRoutes
 },
 {
   path:'/exam-settings/class-subjects',
   routes:ClassSubjectsRoutes
 },
 {
   path:'/exam-settings/reports',
   routes:ReportRoutes
 },
 {
   path:'/exam-settings/signatures',
   routes:SignatureRoutes
 },
 {
   path:'/exam-settings/grades',
   routes:GradeRoutes
 },
 {
   path:'/exam-settings/grade-setup',
   routes:GradeSetupRoutes
 }
 ,
 {
   path:'/exam-settings/set-signatures',
   routes:SetSignatureRoutes
 }
 ,
 {
   path:'/exam-settings/exam-publish',
   routes:ExamPublishRoutes
 }
 ,
 {
   path:'/exam-settings/sequential-exam',
   routes:SequentialExamRoutes
 },
 {
   path:'/exam-result/mark-input',
   routes:MarkInputRoutes
 },
 {
   path:'/exam-result/progress-report',
   routes:ProgressReportRoutes
 },
 {
   path:'/exam-result/unassigned-subject-report',
   routes:UnassignedSubjectReportRoutes
 },
 {
   path:'/exam-result/pass-fail-percentage',
   routes:PassFailPercentageRoutes
 },
 {
   path:'/exam-result/subject-pass-fail-summary',
   routes:SubjectSummaryRoutes
 },
 {
   path:'/exam-result/section-grade-summary',
   routes:SectionGradeSummaryRoutes
 },
 {
   path:'/exam-result',
   routes:tabulationReportRoutes
 }
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
