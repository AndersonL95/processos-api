import { Router } from "express";
import { login, refreshToken } from "../controllers/userController";

const router = Router();

router.post("/login", login);
router.post("refresh_token", refreshToken);

export default router;