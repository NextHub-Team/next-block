import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { AssetRegistryProviderName } from '../../../../types/asset-registry-enum.type';

@Entity({
  name: 'asset_registry',
})
export class AssetRegistryEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  description?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  providerName?: AssetRegistryProviderName | null;

  @Column({
    nullable: true,
    type: String,
  })
  envType?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  chainName: string;

  @Column({
    nullable: false,
    type: String,
  })
  assetId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
