import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, {Express, Request, Response} from "express";
import userRoutes from '../src/api/routes/userRoutes';
import { sequelize } from '../src/services/db'

dotenv.config();
const app: Express = express();
const PORT = process.env.NODE_PORT || 3000;

app.use(bodyParser.json());
app.use('/api',userRoutes);
app.get('/', (req: Request, res: Response)=>{
    res.send("Server funcionando...")

});
const start = async () => {
   try {
    await sequelize.authenticate();
    console.log("Conexão foi estabelecida.");
    await sequelize.sync();
    app.listen(PORT,() =>{
        console.log(`Server is runing ${PORT}.`);
    });
   } catch (error) {
    console.log("Não foi possivel conectar ao banco de dados.", error)
   }
};
start();