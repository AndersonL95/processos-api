import { Request, Response } from "express";
import AppDataSource from '../../../typeormConfig';
import { Sector } from "../../entity/Sector";


    export const createSector = async (req: Request, res: Response) => {
        const { name } = req.body;
        const tenantId = req.body.tenantId;

      
    
        const existSector = await Sector.findOne({ where: { name, tenantId } });
        if (existSector) {
            return res.status(409).send({ message: "Setor já existe!" });
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
            res.status(500).send({ message: "Erro ao criar setor!", error });
        }
    };


export const listSector = async (req: Request, res: Response) => {
    const sectorPath = AppDataSource.getRepository(Sector);
    const tenantId = req.body.tenantId;

    const sector = await sectorPath.find({where:{tenantId: tenantId}});
    res.status(200).send(sector);
}

export const deleteSector = async (req: Request, res: Response) => {
    const sectorId = parseInt(req.params.id);
    const tenantId = req.body.tenantId;
    console.log("DATA: ", sectorId, "TENANTID: ", tenantId);

    const sector = await Sector.findOne({where: {id: sectorId, tenantId}});
    if(!sector) return res.status(404).send("Setor não encontrado.");

    await sector.remove();
    res.status(200).send("Setor excluido.");
};






