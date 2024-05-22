require("dotenv").config();
import express, {Express, Request, Response} from "express";

const app: Express = express();
const port = process.env.NODE_DOCKER || 8080;


app.get('/', (req: Request, res: Response)=>{
    res.send("Server run")
});
app.listen(port,() =>{
    console.log(`Server is runing ${port}.`);
});