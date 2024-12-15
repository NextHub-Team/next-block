import { PermissionEntity } from '../../../../../permissions/infrastructure/persistence/relational/entities/permission.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'access_control',
})
export class AccessControlEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  description?: string | null;

  @OneToOne(() => PermissionEntity, { eager: true, nullable: true })
  @JoinColumn()
  permission?: PermissionEntity | null;

  @OneToOne(() => StatusEntity, { eager: true, nullable: true })
  @JoinColumn()
  status?: StatusEntity | null;

  @OneToOne(() => RoleEntity, { eager: true, nullable: false })
  @JoinColumn()
  role: RoleEntity;

  @OneToOne(() => UserEntity, { eager: true, nullable: false })
  @JoinColumn()
  user: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
