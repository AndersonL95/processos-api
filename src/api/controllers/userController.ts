import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { User } from '../../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});
export const createUser = async (req: Request, res: Response) =>{
    const { username, name, email, password, phone, cpf, cargo, photo, role, active} = req.body;
    const tenantId = req.body.tenantId;
    console.log("TENANTID: ",tenantId);
    
    if(!name || !email || !password) {
        res.status(400).send({ message: "É necessario inserir nome e email e senha!"});
        return;
    }
    const existUser = await User.findOne({ where: { email, name } });
    if (existUser) {
        return res.status(409).send({ message: "Usuario já existe!" });
    }

    try {
        const photoBase64 = req.file ? req.file.buffer.toString('base64') : null;
        const newUser = User.create({ username, name, email, password, phone, cpf, cargo, photo, role, active, tenantId });
        await newUser.save();
        res.status(201).send({id: newUser.id, username: newUser.username, name: newUser.name, email: newUser.email, phone: newUser.phone, cpf: newUser.cpf, cargo: newUser.cargo,photo: newUser.photo, role: newUser.role, active: newUser.active});
        
    } catch (error) {
        res.status(500).send({message: "Erro ao criar usuario!", error})
    }
    
};

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({where: {tenantId: req.body.tenantId}});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({message: 'Erro ao tentar buscar os usuarios!', error});
    }
    
};
export const getUser = async (req: Request, res: Response) => {
    const userID = parseInt(req.params.id);
    const tenantId = req.body.tenantId;
    const user = await User.findOne({where: {id: userID, tenantId}});
    if(!user) return res.status(404).send("Usuario não encontrado.");
    res.send(user);
    
}
export const updateUser = async (req: Request, res: Response) => {
    const userID = parseInt(req.params.id);
    const tenantId = req.body.tenantId;

    const user = await User.findOne({where: {id: userID, tenantId}});
    if(!user) return res.status(404).send("Usuario não encontrado.");

    try{
        if(req.file){
            const image64 = req.file.buffer.toString('base64');
            user.photo = image64;
        }
        User.merge(user, req.body);
        await user.save();
        res.send(user);
    }catch(e){

    }
};
export const deleteUser = async (req: Request, res: Response) => {
    const userID = parseInt(req.params.id);
        const tenantId = req.body.tenantId;

    const user = await User.findOne({where: {id: userID, tenantId}});
    if(!user) return res.status(404).send("Usuario não encontrado.");

    await user.remove();
    res.send("Usuario excluido.");
};



const genAccessToken = (user: User) => {
    return jwt.sign({id: user.id, tenantId: user.tenantId}, process.env.SECRET_KEY_JWT as string, {expiresIn: "10m"});
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
    
    res.send({ accessToken, refreshToken, id: user.id, tenantId: user.tenantId});
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
 


 export const uploadUserAuth = upload.single('photo');