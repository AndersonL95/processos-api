import { Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';

@Entity('sector')
export class Sector extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tenantId: number;

    @Column()
    @Length(15,60)
    name: string;
}
