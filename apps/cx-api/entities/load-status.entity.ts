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
import { LoadDetailsEntity } from './load-details.entity';

@Entity('load_statuses')
export class LoadStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => LoadEntity, (load) => load.statuses)
  // load: LoadEntity;

  // @ManyToOne(() => LoadDetailsEntity, (subLoad) => subLoad.statuses)
  // subLoad: LoadDetailsEntity;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
