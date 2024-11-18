import { Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { UserNotification } from "./UseNotification";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

   

    @Column()
    tenantId: number;

    @Column()
    @Length(15,60)
    message: string;
    

    @Column()
    contractId: number;

    @OneToMany(() => UserNotification, (useNotification) => useNotification.notification)
    userNotifications: UserNotification[];
}