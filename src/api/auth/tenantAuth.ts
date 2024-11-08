import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const tenantAuth = (req: Request, res: Response, next: NextFunction) => {
   const tenantId = req.headers['x-tenant-id'] as string
   if(!tenantId){
        return res.status(400).send(`Tenant ID: ${tenantId} não encontrado.`)
   }
   req.body.tenantId = parseInt(tenantId as string);
   next();
};
