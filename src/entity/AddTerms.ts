import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contract } from "./Process";

@Entity()
export class AddTerm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenantId: number;

  @Column()
  nameTerm: string;

  @Column({ nullable: true })
  file: string;

  @ManyToOne(() => Contract, (contract) => contract.add_term, { onDelete: 'CASCADE', })
  contract: Contract;

  @Column()
  contractId: number;
}
