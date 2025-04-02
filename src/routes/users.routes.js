import { Router } from 'express';
import { deleteUser, getUsers } from '../controllers/users.controller.js';

const router = Router();

router.get('/users', getUsers);
router.get('/users/search', getUsers);
router.delete('/users/:id', deleteUser);

export default router;