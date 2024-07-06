import { Router } from "express";
import { login, refreshToken } from "../controllers/userController";

const router = Router();

router.post("/login", login);
router.post("/refresh_token", refreshToken);
router.post('/logout', (req, res) =>{
    return res.status(200).send({message: "Logout feito com sucesso."})
})

export default router;