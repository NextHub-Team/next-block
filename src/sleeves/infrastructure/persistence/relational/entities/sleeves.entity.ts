import { AssetRegistryEntity } from '../../../../../asset-registries/infrastructure/persistence/relational/entities/asset-registry.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'sleeves',
})
export class SleevesEntity extends EntityRelationalHelper {
  @ManyToOne(() => AssetRegistryEntity, { eager: true, nullable: false })
  asset: AssetRegistryEntity;

  @Column({
    nullable: true,
    type: String,
  })
  tag?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @Column({
    nullable: false,
    type: String,
  })
  sleeveId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
