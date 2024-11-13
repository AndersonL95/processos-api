import { Notification } from "../../entity/Notifications";
import { Contract } from "../../entity/Process";
import AppDataSource from "../../../typeormConfig";
import { Between, LessThan, MoreThan, MoreThanOrEqual } from "typeorm";
import { Request, Response } from "express";

export const processNotification = async() => {
    const contractRepo = AppDataSource.getRepository(Contract);

    const expiresIn30 = await contractRepo.find({
        where:{
            finalDate: MoreThanOrEqual(new Date(new Date().setMonth(new Date().getMonth() + 1))),
        }
    });
    const notifications = expiresIn30.map(contract =>({
        contractId: contract.id,
        message: `Contrato ${contract.name} expira em breve.`,
        expiryDate: contract.finalDate

    }));
    const notificationRepository = AppDataSource.getRepository(Notification);
    await notificationRepository.save(notifications);

    return notifications;
   
}
export const listNotifications = async (req: Request, res: Response) => {
    const tenantId = req.body.tenantId;

    try{
        const notifications = await processNotification();
    

        res.status(200).json({notifications});
    }catch(e){
        res.status(500).json({message: "Erro ao listar notificações"})
    }
}
export const markAsRead = async (req: Request, res: Response) => {
    const {id} = req.params;
    const tenantId = req.body.tenantId;

    const notificationRepository = AppDataSource.getRepository(Notification);
    const notification = await     notificationRepository.find({
        where: { tenantId: tenantId },
        order: { createdAt: "DESC" },
    });    if(notification){
       
        await notificationRepository.save(notification);
        res.sendStatus(204);
    }else {
        res.sendStatus(404);
    }
}