import { Request, Response } from "express";
import multer from "multer";
import { FindOneOptions } from "typeorm";
import { Contract } from "../../entity/Process";
import { processNotification } from "./notificationController";
import AppDataSource from "../../../typeormConfig";
import { AddTerm } from "../../entity/AddTerms";

const storage = multer.memoryStorage()
    

const upload = multer({storage});


export const createContract = async (req: Request, res: Response) => {
    try {
      const {
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
        addQuant,
        companySituation,
        sector,
        active,
        userId,
        tenantId,
        file: fileBase64,
        add_term: addTermBase64,
      } = req.body;
  
      
  
      const existContract = await Contract.findOne({ where: { numContract, tenantId } });
      if (existContract) {
        return res.status(409).send({ message: "Contrato já existe!" });
      }
  
      const contractRepo = AppDataSource.getRepository(Contract);
      const addTermRepo = AppDataSource.getRepository(AddTerm);
      const fileBuffer = fileBase64 ? Buffer.from(fileBase64, 'base64') : null;
      const newContract = contractRepo.create({
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
        addQuant,
        companySituation,
        tenantId,
        sector,
        active,
        userId,
        file: fileBuffer?.toString("base64"),
      });
  
      await contractRepo.save(newContract);
  
      if (addTermBase64?.length > 0) {
        const addTermEntities = addTermBase64.map((term: { file: any; nameTerm: string }) => {
          return addTermRepo.create({
            contract: newContract,
            contractId: newContract.id,
            tenantId: newContract.tenantId,
            nameTerm: term.nameTerm,
            file: term.file, 
          });
        });

      await addTermRepo.save(addTermEntities);
}

  
      const textNotification = `Contrato ${newContract.name} foi adicionado`;
      const notification = await processNotification(tenantId, textNotification);
  
      const createdContract = await contractRepo.findOne({
        where: { id: newContract.id },
        relations: ['add_term'],
      });
  
      res.status(201).send({ contract: createdContract, notification });
  
    } catch (error) {
      console.error("Erro ao criar contrato:", error);
      res.status(500).send({ message: "Erro ao criar contrato!", error });
    }
  };
  
   export const createAddTerm = async (req: Request, res: Response) => {
    const { contractId, tenantId, nameTerm, file } = req.body;
  
    const contractRepo = AppDataSource.getRepository(Contract);
    const addTermRepo = AppDataSource.getRepository(AddTerm);
  
    const contract = await contractRepo.findOne({ where: { id: contractId, tenantId } });
  
    if (!contract) {
      return res.status(404).json({ message: 'Contrato não encontrado' });
    }
  
    const newAddTerm = addTermRepo.create({
      nameTerm,
      file,
      contract,
      contractId,
      tenantId,
    });
  
    try {
      await addTermRepo.save(newAddTerm);
      return res.status(201).json(newAddTerm);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Erro ao salvar termo aditivo' });
    }
  };


export const listContracts = async (req: Request, res: Response) => {
    const contractPath = AppDataSource.getRepository(Contract);
    const tenantId = req.body.tenantId;

    const contracts = await contractPath.find({where:{tenantId: tenantId}});
    res.status(200).send(contracts);
}
export const listContractId = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Id inválido.' });
    }
  
    const contractRepo = AppDataSource.getRepository(Contract);
  
    try {
      const contract = await contractRepo.findOne({
        where: { id },
        relations: ['add_term'],
      });
  
      if (!contract) {
        return res.status(404).send({ error: 'Contrato não encontrado' });
      }
  
      res.status(200).send(contract);
    } catch (error) {
      res.status(500).send({ error: 'Erro interno no servidor' });
    }
  };
  


export const list3LastContracts = async (req: Request, res: Response) => {
    const contractPath = AppDataSource.getRepository(Contract);
    const tenantId = req.body.tenantId;

    if (!tenantId) {
        return res.status(400).send({ error: 'tenantId is required' });
    }

    try {
        const contracts = await contractPath.find({
            where: { tenantId: tenantId },
            order: { id: "DESC" },
            take: 3
        });

        if (contracts.length === 0) {
            return res.status(404).send({ error: 'No contracts found for this tenant' });
        }

        res.status(200).send(contracts);
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
};

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


export const updateContract = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {
      name, numProcess, numContract, manager, supervisor, initDate, finalDate,
      contractLaw, contractStatus, balance, todo, addQuant, companySituation,
      sector, active, userId, file, tenantId, add_term
    } = req.body;
  
    const contractRepo = AppDataSource.getRepository(Contract);
    const addTermRepo = AppDataSource.getRepository(AddTerm);
  
    let existingContract = await contractRepo.findOne({
      where: { id, tenantId },
      relations: ['add_term'],
    });
    
  
    if (!existingContract) {
      return res.status(404).send({ message: "Contrato não encontrado." });
    }
  
    Object.assign(existingContract, {
      name, numProcess, numContract, manager, supervisor, initDate, finalDate,
      contractLaw, contractStatus, balance, todo, addQuant, companySituation,
      sector, active, userId, tenantId,
      ...(file && { file }),
    });
  
    if (add_term && Array.isArray(add_term)) {
      const updatedTermIds = add_term.filter((term: any) => term.id).map((term: any) => term.id);
      const existingTerms = existingContract?.add_term ?? [];
      const termsToDelete = existingTerms.filter(term => !updatedTermIds.includes(term.id));
      for (const term of termsToDelete) {
        await addTermRepo.delete(term.id);
      }
    
   for (const term of add_term) {
  if (term.id && typeof term.id === 'number') {
    
    const existingTerm = await addTermRepo.findOne({ where: { id: term.id } });

    if (existingTerm) {
      await addTermRepo.save({
        id: term.id,
        tenantId,
        contractId: id,
        nameTerm: term.nameTerm,
        file: term.file,
      });
    }
  } else {
    
    const newTerm = addTermRepo.create({
      nameTerm: term.nameTerm,
      file: term.file,
      contractId: id,
      tenantId,
    });

    await addTermRepo.save(newTerm);
  }
}



}

  
    try {
      await contractRepo.save(existingContract);
      const textNotification = `Contrato ${existingContract.name} foi modificado`;
      const notification = await processNotification(tenantId, textNotification);
  
      res.status(200).send({ contract: existingContract, notification });
    } catch (e) {
      res.status(500).send({ message: "Erro ao atualizar contrato" });
    }
  };
 
  export const deleteAddTerm = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
  
    const addTermRepo = AppDataSource.getRepository(AddTerm);
    const term = await addTermRepo.findOne({ where: { id } });
  
    if (!term) {
      return res.status(404).send({ message: "Termo aditivo não encontrado." });
    }
  
    await addTermRepo.remove(term);
    return res.status(200).send({ message: "Termo aditivo excluído com sucesso." });
  };

  
export const uploadAuth = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'add_term', maxCount: 10 },
  ]);
  