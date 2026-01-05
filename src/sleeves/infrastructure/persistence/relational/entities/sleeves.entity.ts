import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { SleevesEnvType } from 'src/sleeves/types/sleeves-enum.type';


@Entity({
  name: 'sleeves',
})
export class SleevesEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: 'enum',
    enum: SleevesEnvType,
    enumName: 'sleeves_env_type_enum',
    default: SleevesEnvType.Testnet,
  })
  envType: SleevesEnvType;

  @Column({
    nullable: true,
    type: String,
  })
  tag?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  chainName: string;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @Column({
    nullable: false,
    type: String,
  })
  contractAddress: string;

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
