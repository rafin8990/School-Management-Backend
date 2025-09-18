import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = Router();

router.post(
  '/',
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory
);

router.get(
  '/',
  validateRequest(CategoryValidation.getAllCategoriesZodSchema),
  CategoryController.getAllCategories
);

router.get(
  '/:id',
  validateRequest(CategoryValidation.getSingleCategoryZodSchema),
  CategoryController.getSingleCategory
);

router.patch(
  '/:id',
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  validateRequest(CategoryValidation.deleteCategoryZodSchema),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;


