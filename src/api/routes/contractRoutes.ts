import express from 'express';
import { createContract, deleteContract, listContracts, uploadAuth  } from '../controllers/processControlers';

const router = express.Router();


router.post('/contract', uploadAuth, createContract);
router.get('/contract', listContracts);
router.delete('/contract/:id', deleteContract);

export default router;