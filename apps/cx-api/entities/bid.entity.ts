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

@Entity('bids')
export class BidEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LoadEntity, (load) => load.bids)
  load: LoadEntity;

  @Column()
  carrier_id: number;

  @Column()
  price: number;

  @Column()
  created_by: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
