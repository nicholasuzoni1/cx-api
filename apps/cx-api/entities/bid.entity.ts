import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bids')
export class BidEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  load_id: number;

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
