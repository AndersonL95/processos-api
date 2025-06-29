import express from 'express';
import { createContract, deleteContract, filterContract, list3LastContracts, listContractId, /*listContractId,*/ listContracts, listNotTermContract, updateContract, uploadAuth  } from '../controllers/processControlers';
import { tenantAuth } from '../auth/tenantAuth';
import { tokenAuth } from '../auth/auth';

const router = express.Router();

router.use(tokenAuth);
router.post('/contract',tenantAuth, uploadAuth, createContract);
router.get('/contract',tenantAuth, listContracts);
router.get('/contractNotTerm',tenantAuth, listNotTermContract);
router.get('/filterContract',tenantAuth, filterContract);
router.get('/contract/:id',tenantAuth, listContractId);
router.delete('/contract/:id',tenantAuth, deleteContract);
router.put('/contract/:id',tenantAuth, updateContract);
router.get('/contract/recent/order',tenantAuth, list3LastContracts);


export default router;


