import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contracts')
export class ContractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  load_id: number;

  @Column()
  shipper_id: number;

  @Column()
  carrier_id: number;

  @Column()
  price: number;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  completed_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
