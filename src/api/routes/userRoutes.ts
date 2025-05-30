import { Router } from "express";
import { createUser, deleteUser, getUser, listUsers, listUsersInAdmin, updateUser, uploadUserAuth } from '../controllers/userController';
import { tokenAuth } from "../auth/auth";
import { tenantAuth } from "../auth/tenantAuth";

const router = Router();

router.post('/users',tenantAuth, createUser, uploadUserAuth);


router.use(tokenAuth);

router.get('/users',tenantAuth, listUsers);
router.get("/users_admin", listUsersInAdmin);
router.get("/users/:id",tenantAuth, getUser);
router.put("/users/:id", tenantAuth,updateUser);
router.delete("/users/:id", tenantAuth,deleteUser);

export default router;