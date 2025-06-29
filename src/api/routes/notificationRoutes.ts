import { Router } from "express";
import { listNotifications, markAsRead } from "../controllers/notificationController";
import { tokenAuth } from "../auth/auth";

const router = Router();
router.use(tokenAuth);
router.get('/notification/:userId', listNotifications);
router.post('/notification/viwed/:id', markAsRead);

export default router;