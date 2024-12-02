import { Request, Response } from "express";
import AppDataSource from '../../typeormConfig';
import { Sector } from "../../entity/Sector";


    export const createSector = async (req: Request, res: Response) => {
        const { name } = req.body;
        const tenantId = req.body.tenantId;

      
    
        const existSector = await Sector.findOne({ where: { name, tenantId } });
        if (existSector) {
            return res.status(409).send({ message: "Secretaria já existe!" });
        }
    
        try {
            const sectorPath = AppDataSource.getRepository(Sector);
            const newSector = sectorPath.create({
                tenantId,
                name,
                
            });

            await sectorPath.save(newSector);

            res.status(201).send(newSector);
        } catch (error) {
            res.status(500).send({ message: "Erro ao criar secretaria!", error });
        }
    };


export const listSector = async (req: Request, res: Response) => {
    const sectorPath = AppDataSource.getRepository(Sector);
    const tenantId = req.body.tenantId;

    const sector = await sectorPath.find({where:{tenantId: tenantId}});
    res.status(200).send(sector);
}







