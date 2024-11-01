import express from 'express';
import { createContract, deleteContract, list3LastContracts, /*listContractId,*/ listContracts, updateContract, uploadAuth  } from '../controllers/processControlers';
import { tenantAuth } from '../auth/tenantAuth';

const router = express.Router();


router.post('/contract',tenantAuth, uploadAuth, createContract);
router.get('/contract',tenantAuth, listContracts);
//router.get('/contract/:id', listContractId);
router.delete('/contract/:id',tenantAuth, deleteContract);
router.put('/contract/:id',tenantAuth, updateContract);
router.get('/contract/recent',tenantAuth, list3LastContracts);


export default router;