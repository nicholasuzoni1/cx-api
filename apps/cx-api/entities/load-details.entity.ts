import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { LoadEntity } from './load.entity';
import { LoadStatusEntity } from './load-status.entity';
import { LoadStatus } from '@app/load-managment/enums/load-statuses';

@Entity('load_details')
export class LoadDetailsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  load_uid: string;

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

  @Column('json', { nullable: true })
  pickup_location: {
    address: string;
    lat: number;
    lng: number;
  };

  @Column({ type: 'timestamptz', nullable: true })
  pickup_datetime: Date;

  @Column('json', { nullable: true })
  destination_location: {
    address: string;
    lat: number;
    lng: number;
  };

  @Column({ type: 'timestamptz', nullable: true })
  arrival_datetime: Date;

  @Column({ default: LoadStatus.DRAFT })
  status?: string;

  @Column()
  order?: number;

  @Column()
  loadId?: number;

  // @OneToMany(() => LoadStatusEntity, (statuses) => statuses.subLoad)
  // statuses: LoadStatusEntity[];

  @ManyToOne(() => LoadEntity, (load) => load.loadDetails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  load: LoadEntity;

  @Column()
  created_by: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
