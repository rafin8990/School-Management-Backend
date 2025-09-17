import express from 'express';
import { DistrictRoutes } from '../modules/district/district.route';
import { ThanaRoutes } from '../modules/thana/thana.route';


const router = express.Router();

const moduleRoutes = [
 {
  path:'/districts',
  routes:DistrictRoutes
 },
 {
  path:'/thanas',
  routes:ThanaRoutes
 }
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
