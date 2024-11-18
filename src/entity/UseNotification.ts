import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Notification } from "./Notifications";

@Entity()
export class UserNotification{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Notification, (notification) => notification.userNotifications)
    @JoinColumn({name: "notificationId"})
    notification: Notification;

    @ManyToOne(() => User, (user) => user.userNotifications)
    @JoinColumn({name: "userId"})
    users: User;

    @Column({default: false})
    read: boolean;

    @CreateDateColumn({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}