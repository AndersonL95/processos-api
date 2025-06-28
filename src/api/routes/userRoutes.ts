import { Router } from "express";
import { createUser, deleteUser, forgotPassword, getUser, listUsers, listUsersInAdmin, resetPassword, updateUser, uploadUserAuth } from '../controllers/userController';
import { tokenAuth } from "../auth/auth";
import { tenantAuth } from "../auth/tenantAuth";
import path from "path";

const router = Router();

router.post('/users',tenantAuth, createUser, uploadUserAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword)
router.use(tokenAuth);

router.get('/users',tenantAuth, listUsers);
router.get("/users_admin", listUsersInAdmin);
router.get("/users/:id",tenantAuth, getUser);
router.put("/users/:id", tenantAuth,updateUser);
router.delete("/users/:id", tenantAuth,deleteUser);


export default router;