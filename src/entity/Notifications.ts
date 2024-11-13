import { Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

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

    @Column()
    read: boolean;

    @CreateDateColumn()
    createdAt: Date;
}