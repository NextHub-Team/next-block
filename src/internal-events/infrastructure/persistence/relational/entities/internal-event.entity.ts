import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'internal_event',
})
export class InternalEventEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: 'jsonb',
    default: () => "'{}'::jsonb",
  })
  payload: Record<string, unknown>;

  @Column({
    nullable: false,
    type: String,
  })
  eventType: string;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt: Date | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
