import { Router } from "express";
import { login, refreshToken } from "../controllers/userController";
import { loginLimiter } from "../auth/auth";

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/refresh_token", refreshToken);
router.post('/logout', (req, res) =>{
    return res.status(200).send({message: "Logout feito com sucesso."})
})

export default router;