import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../entity/User';

export const tenantAuth = async (req: Request, res: Response, next: NextFunction) => {
   const tenantId = req.headers['x-tenant-id'] as string;
   const authToken = req.headers['authorization']?.split(' ')[1];

   if (!authToken) {
       return res.status(401).send('Token de autenticação não fornecido.');
   }

   try {
       const payload: any = jwt.verify(authToken, process.env.SECRET_KEY_JWT as string);
       const user = await User.findOne({ where: { id: payload.id } });

       if (!user) {
           return res.status(401).send('Usuário não encontrado.');
       }

       if (user.role == "superAdmin") {
           next();
       } else {
           if (!tenantId) {
               return res.status(400).send('Tenant ID não encontrado.');
           }
           req.body.tenantId = parseInt(tenantId);
           next();
       }
   } catch (error) {
       return res.status(401).send('Token inválido.');
   }
};
