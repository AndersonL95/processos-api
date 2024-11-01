import { Request, Response } from "express";
import multer from "multer";
import AppDataSource from '../../../typeormConfig';
import { FindOneOptions } from "typeorm";
import { Contract } from "../../entity/Process";

const storage = multer.memoryStorage()
    

const upload = multer({storage});



    export const createContract = async (req: Request, res: Response) => {
        const { name, numProcess, numContract, manager, supervisor, initDate, finalDate, contractLaw, contractStatus, balance, todo, addTerm, addQuant, companySituation, userId, file } = req.body;
        const tenantId = req.body.tenantId;

        if (!file) {
            return res.status(400).send("Nenhum arquivo enviado");
        }
    
        const existContract = await Contract.findOne({ where: { numContract, tenantId } });
        if (existContract) {
            return res.status(409).send({ message: "Contrato já existe!" });
        }
    
        try {
            const contractPath = AppDataSource.getRepository(Contract);
            const newContract = contractPath.create({
                name,
                numProcess,
                numContract,
                manager,
                supervisor,
                initDate,
                finalDate,
                contractLaw,
                contractStatus,
                balance,
                todo,
                addTerm,
                addQuant,
                companySituation,
                tenantId,
                userId,
                file
            });

            await contractPath.save(newContract);

            res.status(201).send(newContract);
        } catch (error) {
            res.status(500).send({ message: "Erro ao criar contrato!", error });
        }
    };


export const listContracts = async (req: Request, res: Response) => {
    const contractPath = AppDataSource.getRepository(Contract);
    const tenantId = req.body.tenantId;

    const contracts = await contractPath.find({where:{tenantId: req.body.tenantId}});
    res.status(200).send(contracts);
}
/*export const listContractId = async (req: Request, res: Response) => {
    const id = req.params;
    const contractPath = AppDataSource.getRepository(Contract);
    const contracts = await contractPath.findOne({where: {id: Number(id)}});
    res.status(200).send(contracts);
}*/
export const list3LastContracts = async (req: Request, res: Response) => {
    const contractPath = AppDataSource.getRepository(Contract);
    const id: number = parseInt(req.params.id);
    const contracts = await contractPath.find({order: {
        tenantId: req.body.tenantId,
        id: "DESC",
    },
    take: 3
});
    res.status(200).send(contracts);
}
export const deleteContract = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const contractPath = AppDataSource.getRepository(Contract);
    const tenantId = req.body.tenantId;


    try {
        await contractPath.findOneOrFail({where:{id, tenantId}});
       
    }catch(error){
        res.status(404).send(error);
        return;
    }
    await contractPath.delete(id);

    res.status(204).send("Contrato excluido.");
}


export const updateContract = async (req: Request, res: Response) =>{
    const id = parseInt(req.params.id);

    const { name, numProcess, numContract, manager, supervisor, initDate, finalDate, contractLaw, contractStatus, balance, todo, addTerm, addQuant, companySituation, userId, file } = req.body;
    const tenantId = req.body.tenantId;

    const contractPath = AppDataSource.getRepository(Contract);
    let updateContract = await contractPath.findOne({where: {id: id, tenantId: req.body.tenantId}});

    if(!updateContract){
        return res.status(404).send({message: "Contrato não encontrado."});
    }
   updateContract = {
    ...updateContract,
        name, numProcess, numContract, manager, supervisor, initDate, finalDate, contractLaw, contractStatus,
        balance, todo, addTerm, addQuant, companySituation,tenantId, userId,
        ...(file && {file}),
        
   }
   //console.log("FEITO!", updateContract)

    try {
        await contractPath.save(updateContract!);
        res.status(200).send(updateContract);
    }catch(e){
        res.status(500).send({message: "Erro ao atualizar contrato"});
    }
}


export const uploadAuth = upload.single('file');