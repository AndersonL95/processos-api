import bcrypt from 'bcrypt';
import { User } from './entity/User';

export const createAdmin = async () => {
  try {
    const userCount = await User.count();
    
    if (userCount === 0) {
      console.log("Tabela de usuários está vazia. Criando usuário administrador...");

      const adminPassword = process.env.ADMIN_PASS || '6003c408beda28988890f085d91';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const userAdmin = User.create({
        username: 'admin',
        name: 'Administrador',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '1234567890',
        cpf: '000.000.000-00',
        cargo: 'Gestor',
        role: 'admin',
        active: "yes",
        tenantId: 0, 
      });
      await userAdmin.save();

      console.log(`Usuário administrador criado com sucesso! Login: admin@example.com, Senha: ${adminPassword}`);
    } else {
      console.log("Usuários já existem na tabela. Nenhuma ação necessária.");
    }
  } catch (error) {
    console.error("Erro ao verificar ou criar usuário administrador:", error);
  }
};
