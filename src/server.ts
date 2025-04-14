import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, {Express, Request, Response} from "express";
import userRoutes from '../src/api/routes/userRoutes';
import authRoutes from '../src/api/routes/authRoutes';
import contractRoutes from '../src/api/routes/contractRoutes';
import AppDataSource from '../typeormConfig';
import path from 'path';
import sectorRoutes from '../src/api/routes/sectorRoutes';
import notificationRoutes from './api/routes/notificationRoutes';
import { createAdmin } from './userAdminCreate';
dotenv.config();
const app: Express = express();
const PORT = parseInt(process.env.NODE_PORT || '3000', 10);


app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit: '50mb',extended:true}))
app.use('/uploads', express.static(path.join(__dirname,'./uploads')));
app.use('/api', authRoutes);
app.use('/api',userRoutes);
app.use('/api',contractRoutes);
app.use('/api', sectorRoutes);
app.use('/api', notificationRoutes);

app.get('/', (req: Request, res: Response)=>{
    res.send("Server funcionando...")

});
const start = async () => {
  await AppDataSource.initialize().then((db: { migrations: any[]; }) =>{
    console.log("DataSource funcionando...",`${db.migrations.map((name) =>{
      console.log("NAME:",name);

    })}`);

  }).catch((erro: any) =>{
    console.log("Erro durante a inicialização.", erro)
  })
  await createAdmin()

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`);
  });
  
};
start();