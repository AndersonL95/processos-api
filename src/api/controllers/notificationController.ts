import { Notification } from "../../entity/Notifications";
import { Contract } from "../../entity/Process";
import AppDataSource from "../../../typeormConfig";
import { Between, LessThan, MoreThan, MoreThanOrEqual } from "typeorm";
import { Request, Response } from "express";
import { UserNotification } from "../../entity/UseNotification";
import { User } from "../../entity/User";

export const processNotification = async (tenantId: number) => {
    const contractRepo = AppDataSource.getRepository(Contract);
    const notificationRepository = AppDataSource.getRepository(Notification);
    const userNotificationRepository = AppDataSource.getRepository(UserNotification);
    const userRepo = AppDataSource.getRepository(User);

    const expiresIn30 = await contractRepo.find({
        where: {
            finalDate: MoreThanOrEqual(new Date(new Date().setMonth(new Date().getMonth() + 1))),
        }
    });

    for (const contract of expiresIn30) {
        const existingNotification = await notificationRepository.findOne({
            where: {
                contractId: contract.id,
                tenantId,
            }
        });

        if (!existingNotification) {
            const notification = notificationRepository.create({
                contractId: contract.id,
                tenantId,
                message: `Contrato ${contract.name} expira em breve.`,
            });

            await notificationRepository.save(notification);

            const users = await userRepo.find({ where: { tenantId } });

            const userNotifications = users.map(user => {
                const userNotification = userNotificationRepository.create({
                    users: user,  
                    notification: notification,  
                    read: false,  
                });
                return userNotification;
            });

            await userNotificationRepository.save(userNotifications);
        }
    }
}
export const listNotifications = async (req: Request, res: Response) => {
    const tenantId = req.body.tenantId;
    const userId = parseInt(req.params.userId);
    try{
        await processNotification(tenantId);
        const notificationRepo = AppDataSource.getRepository(Notification);
        const userNotificationRepo = AppDataSource.getRepository(UserNotification);
        const notification = await notificationRepo.find({
            where: {tenantId: tenantId},
        });
        const useNotifiction = await userNotificationRepo.find({
            where: {users: {id: userId}},
            relations:['notification'],
        });
        const response = notification.map((not) => {
            const useNotifications = useNotifiction.find(
                (e) => e.notification.id === not.id
            );
            return {
                ...not,
                read: useNotifications ? useNotifications.read : false
            };
        });

        res.status(200).json({notifications: response});
    }catch(e){
        res.status(500).json({message: "Erro ao listar notificações"})
    }
}
export const markAsRead = async (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = req.body.userId;
    console.log("ID NOTIFICAÇÂO: ", id, "USERID", userId);
    try {
        const userNotificationRepo = AppDataSource.getRepository(UserNotification);
    let notification = await userNotificationRepo.findOne({
        where: {notification:{id: parseInt(id)}, users:{id: userId}}
        
    });    

    if(notification){
            notification.read = true;

    }else {
        notification = userNotificationRepo.create({
            notification:{id: parseInt(id)},
            users: {id: userId},
            read: true
        });
    }
    await userNotificationRepo.save(notification);
    res.status(200).json({message:"Notificação lida"});
    } catch (error) {
        res.status(500).json({message: "ERRO ao abrir notificação."});
    }
}