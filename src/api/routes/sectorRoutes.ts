import { Router } from "express";
import { tokenAuth } from "../auth/auth";
import { tenantAuth } from "../auth/tenantAuth";
import { createSector, listSector } from "../controllers/sectorController";

const router = Router();



router.use(tokenAuth);

router.get('/sector',tenantAuth, listSector);
router.post('/sector',tenantAuth, createSector);


export default router;