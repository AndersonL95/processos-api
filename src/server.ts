import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, {Express, Request, Response} from "express";
import userRoutes from '../src/api/routes/userRoutes';
import authRoutes from '../src/api/routes/authRoutes';
import contractRoutes from '../src/api/routes/contractRoutes';
import AppDataSource from '../typeormConfig';
import path from 'path';
dotenv.config();
const app: Express = express();
const PORT = process.env.NODE_PORT || 3000;


app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname,'./uploads')));
app.use('/api', authRoutes);
app.use('/api',userRoutes);
app.use('/api',contractRoutes);

app.get('/', (req: Request, res: Response)=>{
    res.send("Server funcionando...")

});
const start = async () => {
  await AppDataSource.initialize().then((db) =>{
    console.log("DataSource funcionando...",`${db.migrations.map((name) =>{
      console.log("NAME:",name);
    })}`)
  }).catch((erro) =>{
    console.log("Erro durante a inicialização.", erro)
  })
  app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`);
  })
};
start();