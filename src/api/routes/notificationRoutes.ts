import { Router } from "express";
import { listNotifications } from "../controllers/notificationController";

const router = Router();

router.get('/notification', listNotifications);

export default router;