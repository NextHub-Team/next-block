import { Transaction } from '../../transactions/domain/transaction';
import { ApiProperty } from '@nestjs/swagger';

export class OrderTransaction {
  @ApiProperty({
    type: () => Transaction,
    nullable: false,
  })
  transaction?: Transaction;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
