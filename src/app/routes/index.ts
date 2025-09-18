import express from 'express';
import { DistrictRoutes } from '../modules/district/district.route';
import { ThanaRoutes } from '../modules/thana/thana.route';
import { SchoolRoutes } from '../modules/school/school.route';


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
 }
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
