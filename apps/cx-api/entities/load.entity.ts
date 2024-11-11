import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BidEntity } from './bid.entity';
import { ContractEntity } from './contract.entity';
import { LoadDetailsEntity } from './load-details.entity';
import { LoadStatus } from '@app/load-managment/enums/load-statuses';

@Entity('loads')
export class LoadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shipper_id: number;

  @Column()
  min_budget: number;

  @Column()
  max_budget: number;

  @Column({
    default: false,
  })
  is_private: boolean;

  @Column({
    default: false,
  })
  is_contract_made: boolean;

  @Column({ default: LoadStatus.DRAFT })
  status?: string;

  @OneToMany(() => BidEntity, (bid) => bid.load)
  bids: BidEntity[];

  @OneToOne(() => ContractEntity, (contract) => contract.load)
  contract: ContractEntity;

  // @OneToMany(() => LoadStatusEntity, (statuses) => statuses.load)
  // statuses: LoadStatusEntity[];

  @OneToMany(() => LoadDetailsEntity, (loadDetails) => loadDetails.load, {
    cascade: true,
  })
  loadDetails: LoadDetailsEntity[];

  @Column()
  created_by: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
