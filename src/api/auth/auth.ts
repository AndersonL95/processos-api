import express, {NextFunction, Request, Response} from "express";
import dotenv from'dotenv';
import jwt from 'jsonwebtoken';
import rateLimit from "express-rate-limit";


dotenv.config();

export const tokenAuth = (req: Request, res: Response, next: NextFunction) =>{
    const authHeaders = req.headers['authorization'];
    if(!authHeaders) return res.status(401).send("Acesso negado!");

    const token = authHeaders.split(' ')[1];
    if(!token) return res.status(401).send("Acesso negado.");
    

    try {
    const decoded = jwt.verify(token,  process.env.SECRET_KEY_JWT as string) as {id: number, tenantId: number};
        req.body.user = decoded;
        req.body.tenantId = decoded.tenantId;
        next();
    } catch (error) {
        res.status(400).send("Token invalido.",);
        console.log(error);
    };
};

export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    handler: (req, res) => {
      res.status(429).json({
        message: "Muitas tentativas de login. Tente novamente mais tarde.",
      });
    },
  });
  
