import express from 'express';
import { DistrictRoutes } from '../modules/district/district.route';


const router = express.Router();

const moduleRoutes = [
 {
  path:'/district',
  routes:DistrictRoutes
 }
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
