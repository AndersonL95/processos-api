import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, {Express, Request, Response} from "express";
import userRoutes from '../src/api/routes/userRoutes';
import dataSource from './config/db';

dotenv.config();
const app: Express = express();
const PORT = process.env.NODE_PORT || 3000;


app.use(bodyParser.json());
app.use('/api',userRoutes);
app.get('/', (req: Request, res: Response)=>{
    res.send("Server funcionando...")

});
const start = async () => {
  await dataSource.initialize();
  app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`);
  })
};
start();