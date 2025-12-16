import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, IsIn } from 'class-validator';

export class RewardMintEventDto {
  @ApiProperty({ type: () => String })
  @IsString()
  userId: string;

  @ApiProperty({ type: () => Number, minimum: 1 })
  @IsInt()
  @Min(1)
  points: number;

  @ApiProperty({ type: () => String, enum: ['Transfer-In', 'Transfer-Out'] })
  @IsString()
  @IsIn(['Transfer-In', 'Transfer-Out'])
  functionType: string;

  @ApiProperty({ type: () => String, enum: ['reward', 'status', 'subscription'] })
  @IsString()
  @IsIn(['reward', 'status', 'subscription'])
  tokenType: string;


  @ApiProperty({ type: () => String })
  @IsString()
  sleeveId: string;
}
