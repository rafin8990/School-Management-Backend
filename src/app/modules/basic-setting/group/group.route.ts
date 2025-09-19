import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { GroupController } from './group.controller';
import { GroupValidation } from './group.validation';

const router = Router();

router.post(
  '/',
  validateRequest(GroupValidation.createGroupZodSchema),
  GroupController.createGroup
);

router.get(
  '/',
  validateRequest(GroupValidation.getAllGroupsZodSchema),
  GroupController.getAllGroups
);

router.get(
  '/:id',
  validateRequest(GroupValidation.getSingleGroupZodSchema),
  GroupController.getSingleGroup
);

router.patch(
  '/:id',
  validateRequest(GroupValidation.updateGroupZodSchema),
  GroupController.updateGroup
);

router.delete(
  '/:id',
  validateRequest(GroupValidation.deleteGroupZodSchema),
  GroupController.deleteGroup
);

export const GroupRoutes = router;