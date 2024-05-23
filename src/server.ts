import dotenv from 'dotenv';
import express, {Express, Request, Response} from "express";

dotenv.config();
const app: Express = express();
const PORT = process.env.NODE_DOCKER_PORT || 8080;


app.get('/', (req: Request, res: Response)=>{
    res.send("Server funcionando...")
});
app.listen(PORT,() =>{
    console.log(`Server is runing ${PORT}.`);
});