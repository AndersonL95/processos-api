import { Router } from "express";
import { createUser, listUsers } from '../controllers/userController';
import { tokenAuth } from "../auth/auth";

const router = Router();

router.post('/users', createUser);
router.get('/users', listUsers, tokenAuth);

export default router;