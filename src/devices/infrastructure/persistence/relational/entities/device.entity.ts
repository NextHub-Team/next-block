import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'device',
})
export class DeviceEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  name?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  physicalId?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  type: string;

  @Column({
    nullable: false,
    type: String,
  })
  token?: string;

  @ManyToOne(() => UserEntity, (parentEntity) => parentEntity.devices, {
    eager: false,
    nullable: false,
  })
  user: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
