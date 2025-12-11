import { ApiProperty } from '@nestjs/swagger';

export class RewardMint {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'User identifier that receives or spends rewards',
  })
  userId: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Amount of reward points to be credited or debited',
  })
  points: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Operation type: Transfer-In or Transfer-Out',
  })
  functionType: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Reward token type: reward or status',
  })
  tokenType: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Optional reason or context',
  })
  reason?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Optional sleeve identifier',
  })
  sleeveId?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Wallet address to mint/burn/transfer rewards',
  })
  walletAddress: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Event timestamp',
  })
  timestamp: string;

  constructor(props: {
    userId: string;
    points: number;
    functionType: string;
    tokenType: string;
    walletAddress: string;
    reason?: string | null;
    sleeveId?: string | null;
    timestamp?: string;
  }) {
    this.userId = props.userId;
    this.points = props.points;
    this.functionType = props.functionType;
    this.tokenType = props.tokenType;
    this.walletAddress = props.walletAddress;
    this.reason = props.reason ?? null;
    this.sleeveId = props.sleeveId ?? null;
    this.timestamp = props.timestamp ?? new Date().toISOString();
  }
}
