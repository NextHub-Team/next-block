import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, IsIn } from 'class-validator';

export class RewardMintEventDto {
  @ApiProperty({
    type: () => String,
    description: 'Event name, for example "points.mint".',
  })
  @IsString()
  event: string;

  @ApiProperty({
    type: () => String,
    description: 'ISO timestamp of the event.',
  })
  @IsString()
  timestamp: string;

  @ApiProperty({
    type: () => String,
    description: 'User identifier that receives or spends rewards.',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    type: () => Number,
    description: 'Amount of reward points.',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  points: number;

  @ApiProperty({
    type: () => String,
    description: 'Operation type: "Transfer-In" to credit or "Transfer-Out" to debit.',
    enum: ['Transfer-In', 'Transfer-Out'],
  })
  @IsString()
  @IsIn(['Transfer-In', 'Transfer-Out'])
  functionType: string;

  @ApiProperty({
    type: () => String,
    description: 'Reward token type, for example "reward" or "status".',
    enum: ['reward', 'status'],
  })
  @IsString()
  @IsIn(['reward', 'status'])
  tokenType: string;

  @ApiProperty({
    required: false,
    type: () => String,
    description: 'Optional reason or context.',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    required: false,
    type: () => String,
    description: 'Optional sleeve identifier.',
  })
  @IsOptional()
  @IsString()
  sleeveId?: string;
}
