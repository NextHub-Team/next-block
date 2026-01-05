import { ApiProperty } from '@nestjs/swagger';
import { SleevesEnvType } from '../types/sleeves-enum.type';

export class Sleeves {
  @ApiProperty({
    enum: SleevesEnvType,
    nullable: false,
  })
  envType: SleevesEnvType;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  tag?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  chainName: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  contractAddress: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  sleeveId: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
