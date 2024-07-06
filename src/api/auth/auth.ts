import express, {NextFunction, Request, Response} from "express";
import dotenv from'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const tokenAuth = (req: Request, res: Response, next: NextFunction) =>{

    const authHeaders = req.headers['authorization'];
    console.log("HEADERS: ", authHeaders);
    if(!authHeaders) return res.status(401).send("Acesso negado!");

    const token = authHeaders.split(' ')[1];
    console.log("TOKEN: ", token);
    if(!token) return res.status(401).send("Acesso negado.");
    

    try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT as string);
        req.body.user = decoded;
        console.log("DECODED",decoded);
        next();
    } catch (error) {
        res.status(400).send("Token invalido.",);
        console.log(error);
    };
};