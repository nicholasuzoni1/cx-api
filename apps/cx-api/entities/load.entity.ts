import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BidEntity } from './bid.entity';
import { ContractEntity } from './contract.entity';
import { LoadStatusEntity } from './load-status.entity';

@Entity('loads')
export class LoadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  load_type: string;

  @Column()
  weight_unit: string;

  @Column()
  weight: number;

  @Column()
  dimension_unit: string;

  @Column('json')
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  @Column()
  vehicle_type: string;

  @Column()
  min_budget: number;

  @Column()
  max_budget: number;

  @Column('json')
  pickup_location: {
    address: string;
    lat: number;
    lng: number;
  };

  @Column({ type: 'timestamptz' })
  pickup_datetime: Date;

  @Column('json')
  destination_location: {
    address: string;
    lat: number;
    lng: number;
  };

  @Column({ type: 'timestamptz' })
  arrival_datetime: Date;

  @Column({
    default: false,
  })
  is_private: boolean;

  @Column()
  created_by: number;

  @Column()
  shipper_id: number;

  @OneToMany(() => BidEntity, (bid) => bid.load)
  bids: BidEntity[];

  @OneToOne(() => ContractEntity, (contract) => contract.load, {
    cascade: true, // Optional: cascades operations like save and remove
  })
  @JoinColumn() // This specifies that this entity owns the relationship
  contract: ContractEntity;

  @OneToMany(() => LoadStatusEntity, (bid) => bid.load)
  statuses: LoadStatusEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
