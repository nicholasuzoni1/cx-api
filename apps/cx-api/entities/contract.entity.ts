import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
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

  @OneToOne(() => LoadEntity, (load) => load.contract)
  @JoinColumn()
  load: LoadEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
