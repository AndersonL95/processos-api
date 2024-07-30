import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { User } from '../../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();


export const createUser = async (req: Request, res: Response) =>{
    const { username, name, email, password, phone, cpf, cargo} = req.body;
    
    if(!name || !email || !password) {
        res.status(400).send({ message: "É necessario inserir nome e email e senha!"});
        return;
    }
    try {
        const newUser = await User.create({username,name,email,password,phone,cpf,cargo});
        await newUser.save();
        res.status(201).send({id: newUser.id, username: newUser.username, name: newUser.name, email: newUser.email, phone: newUser.phone, cpf: newUser.cpf, cargo: newUser.cargo});
        
    } catch (error) {
        res.status(500).send({message: "Erro ao criar usuario!", error})
    }
    
};

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({message: 'Erro ao tentar buscar os usuarios!', error});
    }
    
};
export const getUser = async (req: Request, res: Response) => {
    const userID = parseInt(req.params.id);
    const user = await User.findOne({where: {id: userID}});
    if(!user) return res.status(404).send("Usuario não encontrado.");
    res.send(user);
    
}
export const updateUser = async (req: Request, res: Response) => {
    const userID = parseInt(req.params.id);
    const user = await User.findOne({where: {id: userID}});
    if(!user) return res.status(404).send("Usuario não encontrado.");

    User.merge(user, req.body);
    await user.save();
    res.send(user);
};
export const deleteUser = async (req: Request, res: Response) => {
    const userID = parseInt(req.params.id);
    const user = await User.findOne({where: {id: userID}});
    if(!user) return res.status(404).send("Usuario não encontrado.");

    await user.remove();
    res.send("Usuario excluido.");
};



const genAccessToken = (user: User) => {
    return jwt.sign({id: user.id}, process.env.SECRET_KEY_JWT as string, {expiresIn: "10m"});
};
const genRefreshToken = (user: User) => {
    return jwt.sign({id: user.id}, process.env.REFRESH_SECRET_KEY as string, {expiresIn: "7d"});
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({where:{email}});

    if(!user)return res.status(404).send("Usuario não encontrado.");
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return res.status(401).send("Senha invalida.");

    const accessToken = genAccessToken(user);
    const refreshToken = genRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    
    res.send({ accessToken, refreshToken, id: user.id});
}
 export const refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    if(!token) return res.status(401).send("Token não encontrado.");

    let payload: any;

    try {
        payload = jwt.verify(token, process.env.REFRESH_SECRET_KEY as string);
    } catch (error) {
        return res.status(401).send("Token invalido!.");
    }
    const user = await User.findOne({where :{id: payload.id}});
    if(!user || user.refreshToken !== token) return res.status(401).send("RefreshToken invalido.");

    const accessToken = genAccessToken(user);
    const newRefreshToken = genRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.send({ accessToken, refreshToken: newRefreshToken})
 };
 


 