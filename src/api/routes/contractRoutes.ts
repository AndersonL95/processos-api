import express from 'express';
import { createContract, deleteContract, list3LastContracts, listContracts, uploadAuth  } from '../controllers/processControlers';

const router = express.Router();


router.post('/contract', uploadAuth, createContract);
router.get('/contract', listContracts);
router.delete('/contract/:id', deleteContract);
router.get('/contract/recent', list3LastContracts);


export default router;