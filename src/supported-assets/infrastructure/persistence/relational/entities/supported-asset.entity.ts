import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'supported_asset',
})
export class SupportedAssetEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  protocol?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  nativeAsset?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  issuerAddress?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  type: string;

  @Column({
    nullable: true,
    type: Number,
  })
  decimals?: number | null;

  @Column({
    nullable: true,
    type: String,
  })
  contractAddress?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  blockchain: string;

  @Column({
    nullable: false,
    type: String,
  })
  symbol: string;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
