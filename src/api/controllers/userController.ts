import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { User } from '../../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { randomBytes } from 'crypto';
import { PasswordResetToken } from '../../entity/PasswordReset';
import { sendResetEmail } from '../../send_email.service';

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

export const createUser = async (req: Request, res: Response) =>{
    const { username, name, email, password, phone, cpf, cargo, photo, role, active} = req.body;
    const tenantId = req.body.tenantId;    
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
    const tenantId = req.body.tenantId;
    

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string)?.toLowerCase() || '';
    const queryBuilder = User.createQueryBuilder('user')
      .where('user.tenantId = :tenantId', { tenantId });

   if (search) {
    queryBuilder.andWhere(`(
      LOWER(user.name) LIKE :search 
      OR LOWER(user.email) LIKE :search
      OR user.phone LIKE :search
      OR LOWER(user.cargo) LIKE :search
      OR LOWER(user.username) LIKE :search
  )`, { search: `%${search}%` });
}


    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    res.status(200).json({
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar buscar os usuários!', error });
  }
};


export const listUsersInAdmin = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string)?.toLowerCase() || '';

    const queryBuilder = User.createQueryBuilder('user');

   if (search) {
      queryBuilder.andWhere(`
      LOWER(user.name) LIKE :search 
      OR LOWER(user.email) LIKE :search
      OR user.phone LIKE :search
      OR LOWER(user.cargo) LIKE :search
      OR LOWER(user.username) LIKE :search
  `, { search: `%${search}%` });
}


    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    res.status(200).json({
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar buscar os usuários!', error });
  }
};


export const getUser = async (req: Request, res: Response) => {
    const userID = parseInt(req.params.id);
    const tenantId = req.body.tenantId;
    const user = await User.findOne({where: {id: userID, tenantId}});
    if(!user) return res.status(404).send("Usuario não encontrado.");
    res.send(user);
    
};

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

    return jwt.sign({id: user.id, tenantId: user.tenantId}, process.env.SECRET_KEY_JWT as string, {expiresIn: "20m"});
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
    
    res.send({ accessToken, refreshToken, id: user.id, tenantId: user.tenantId, role: user.role});
};

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
 


export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(200).json({ message: "Se o e-mail existir, enviaremos instruções" });
  }
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); 
  await PasswordResetToken.create({
    token,
    user,
    tenantId: user.tenantId,
    expiresAt
  }).save();

  const resetLink = `http://localhost:3000/reset_pass?token=${token}`;
  await sendResetEmail(user.email, resetLink);
  return res.json({ message: "Link de redefinição enviado." });
};



export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const resetToken = await PasswordResetToken.findOne({
    where: { token, used: false },
    relations: ["user"]
  });

  if (!resetToken || resetToken.expiresAt < new Date())
    return res.status(400).json({ message: "Token inválido ou expirado" });
  

  const hashed = await bcrypt.hash(newPassword, 10);
  resetToken.user.password = hashed;
  await resetToken.user.save();

  resetToken.used = true;
  await resetToken.save();

  return res.json({ message: "Senha redefinida com sucesso" });
  
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = parseInt(req.params.id);
  const tenantId = req.body.tenantId;

  try {
    const user = await User.findOneBy({ id: userId, tenantId: tenantId });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha atual incorreta." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Senha atualizada com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao trocar a senha." });
  }
};
 export const uploadUserAuth = upload.single('photo');