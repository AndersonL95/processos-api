import express from 'express';
import { createContract, deleteContract, list3LastContracts, /*listContractId,*/ listContracts, updateContract, uploadAuth  } from '../controllers/processControlers';

const router = express.Router();


router.post('/contract', uploadAuth, createContract);
router.get('/contract', listContracts);
//router.get('/contract/:id', listContractId);
router.delete('/contract/:id', deleteContract);
router.put('/contract/:id', updateContract);
router.get('/contract/recent', list3LastContracts);


export default router;