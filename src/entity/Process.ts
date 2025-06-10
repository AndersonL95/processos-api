import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import {Length} from 'class-validator';
import { User } from './User';
import { AddTerm } from './AddTerms';

@Entity('contract')
export class Contract extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tenantId: number;
    
    @Column()
    @Length(4, 30)
    name: string;
    
    @Column()
    @Length(4, 30)
    numProcess: string;

    @Column()
    @Length(11,30)
    numContract:string;

    @Column()
    @Length(8, 100)
    manager:string;

    @Column()
    @Length(10, 30)
    supervisor:string;

    @Column()
    @Length(1, 1)
    initDate:Date;

    @Column()
    @Length(11, 11)
    finalDate:Date;

    @Column()
    @Length(11, 30)
    contractLaw:string;

    @Column()
    @Length(11, 30)
    contractStatus: string;
    

    @Column()
    @Length(11, 30)
    balance: string;

    @Column()
    @Length(11, 30)
    todo: string;

    @OneToMany(() => AddTerm, (add_term) => add_term.contract, { cascade: true })
    add_term?: AddTerm[];

    

    @Column()
    @Length(11, 30)
    addQuant: string;

    @Column()
    @Length(11, 30)
    companySituation: string;

    @Column()
    @Length(10,20)
    active: string;

    @Column()
    @Length(11,50)
    sector: string;

   @ManyToOne(() => User)
   @JoinColumn({name: 'userId'})
   user: User;

   @Column()
   userId: number;

   @Column({type:"text"})
   file: string;
    
   
}