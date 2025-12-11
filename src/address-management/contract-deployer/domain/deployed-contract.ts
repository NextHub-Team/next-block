import { ApiProperty } from '@nestjs/swagger';

export class DeployedContract {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'On-chain address of the deployed contract',
  })
  address: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Logical name of the contract type (e.g. ContactBook)',
  })
  name: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Network identifier (e.g. avax-fuji, sepolia)',
  })
  network: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Deployment timestamp',
  })
  deployedAt: Date;

  constructor(props: { address: string; name: string; network: string; deployedAt?: Date }) {
    this.address = props.address;
    this.name = props.name;
    this.network = props.network;
    this.deployedAt = props.deployedAt ?? new Date();
  }
}
