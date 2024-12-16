import { NotificationEntity } from '../../../../../notifications/infrastructure/persistence/relational/entities/notification.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'device',
})
export class DeviceEntity extends EntityRelationalHelper {
  @OneToMany(() => NotificationEntity, (childEntity) => childEntity.device, {
    eager: true,
    nullable: true,
  })
  notifications?: NotificationEntity[] | null;

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
