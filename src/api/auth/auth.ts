import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey = process.env.SECRET_KEY_JWT;
export const tokenAuth = (req: Request, res: Response, next: NextFunction) =>{

    const token = req.headers['authorization'];
    if(!token) return res.status(401).send("Acesso negado!");

    try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY_JWT as string);
        req.body.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Token invalido.");
    };
};