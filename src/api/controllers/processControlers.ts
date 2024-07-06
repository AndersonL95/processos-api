import { Request, Response } from "express";
import multer from "multer";
import AppDataSource from '../../../typeormConfig';
import { FindOneOptions } from "typeorm";
import { Contract } from "../../entity/Process";
import { where } from "sequelize";
import { parse } from "path";

const storage = multer.memoryStorage()
    

const upload = multer({storage});



export const createContract = async (req: Request, res: Response) =>{
    const { numProcess, numContract, manager, supervisor, initDate, finalDate, contractLaw, contractStatus, balance,
        todo, addTerm, addQuant, companySituation, userId } = req.body;
    const file = req.file;
    const existContract = await Contract.findOne({where: {numContract}});
    if(existContract) return res.status(409).send({message: "Contrato já existe!"})
    console.log("ARQUIVO PDF:",file?.buffer);

    if(!file){
        return res.status(400).send("Nenhum arquivo enviado");
        
    }
    const contractPath = AppDataSource.getRepository(Contract);
    const contract = new Contract();
    contract.numContract = numContract;
    contract.numProcess = numProcess
    contract.manager = manager;
    contract.supervisor = supervisor;
    contract.initDate = initDate;
    contract.finalDate = finalDate;
    contract.contractLaw = contractLaw;
    contract.contractStatus = contractStatus;
    contract.balance = balance;
    contract.todo = todo;
    contract.addTerm = addTerm;
    contract.addQuant = addQuant; 
    contract.companySituation = companySituation;
    contract.userId = userId;
    contract.file = file.buffer.toString('base64');
    try {
   
        await contractPath.save(contract);
     } catch (error) {
         res.status(500).send({message: "Erro ao criar contrato!", error})
     }
     res.status(201).send(contract);
};

export const listContracts = async (req: Request, res: Response) => {
    const contractPath = AppDataSource.getRepository(Contract);
    const contracts = await contractPath.find();
    res.status(200).send(contracts);
}
export const deleteContract = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const contractPath = AppDataSource.getRepository(Contract);

    try {
        await contractPath.findOneOrFail({where:{id}});
       
    }catch(error){
        res.status(404).send(error);
        return;
    }
    await contractPath.delete(id);

    res.status(204).send("Contrato excluido.");
}





export const uploadAuth = upload.single('file');