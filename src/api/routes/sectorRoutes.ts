import { Router } from "express";
import { tokenAuth } from "../auth/auth";
import { tenantAuth } from "../auth/tenantAuth";
import { createSector, listSector } from "../controllers/sectorController";

const router = Router();

router.post('/sector',tenantAuth, createSector);


router.use(tokenAuth);

router.get('/sector',tenantAuth, listSector);

export default router;