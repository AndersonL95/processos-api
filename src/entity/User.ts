import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert } from 'typeorm';
import {IsEmail, Length} from 'class-validator';
import bcrypt from 'bcrypt';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tenantId: number;
    
    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4,10)
    role: string

    @Column()
    @Length(10,20)
    active: string;

    @Column()
    @Length(11,30)
    email:string;

    @Column()
    @Length(8, 100)
    password:string;

    @Column()
    @Length(10, 30)
    name:string;

    @Column()
    @Length(1, 1)
    cargo:string;

    @Column()
    @Length(11, 11)
    cpf:string;

    @Column()
    @Length(11, 14)
    phone:string;

    @Column({nullable: true})
    refreshToken: string;

    @Column({ type: 'text', nullable: true })
    photo: string;
    

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}