import { Router } from "express";
import { listNotifications, markAsRead } from "../controllers/notificationController";

const router = Router();

router.get('/notification/:userId', listNotifications);
router.post('/notification/viwed/:id', markAsRead);

export default router;