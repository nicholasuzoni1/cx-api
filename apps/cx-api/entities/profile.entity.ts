import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { DocumentEntity } from './document.entity';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_name: string;

  @Column({ nullable: true })
  contact_number: string;

  @Column({ nullable: true })
  fax_number: string;

  @Column({ nullable: true })
  license_number: string;

  @Column({ nullable: true })
  tax_number: string;

  @Column({ nullable: true })
  dot_number: string;

  @Column({ default: false })
  safer_verified: boolean;

  @OneToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn() // Indicates the owning side of the relationship
  user: UserEntity;

  // @OneToOne(() => AddressEntity, (address) => address.profile)
  // @JoinColumn()
  // address: AddressEntity;

  @OneToMany(() => DocumentEntity, (documents) => documents.profile)
  @JoinColumn()
  documents: DocumentEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
