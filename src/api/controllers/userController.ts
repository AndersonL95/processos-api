import { Request, Response } from 'express';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response): Promise<void> =>{
    const { name, email, password, phone, cpf, cargo} = req.body;
    
    if(!name || !email || !password) {
        res.status(400).send({ message: "É necessario inserir nome e email e senha!"});
        return;
    }
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({name,email,password:hashPassword,phone,cpf,cargo});
        res.status(201).send({id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, cpf: newUser.cpf, cargo: newUser.cargo});
        
    } catch (error) {
        res.status(500).send({message: "Erro ao criar usuario!", error})
    }
    
};

export const listUsers = async (req: Request, res: Response): Promise<void> =>{
    try {
        const users = await User.findAll();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({message: 'Erro ao tentar buscar os usuarios!', error});
    }
    
};
