import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { LoadEntity } from './load.entity';

@Entity('contracts')
export class ContractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  carrier_id: number;

  @Column()
  price: number;

  @Column()
  status: string;

  @ManyToOne(() => LoadEntity, (load) => load.bids)
  load: LoadEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
