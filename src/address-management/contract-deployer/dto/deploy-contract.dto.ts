import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class DeployContractDto {
  @ApiProperty({
    required: true,
    type: () => String,
    description: 'Solidity contract name without .sol extension (e.g. RewardToken)',
  })
  @IsString()
  contractName: string;

  @ApiProperty({
    required: false,
    type: () => String,
    description:
      'Solidity compiler version (e.g. 0.8.28). Only used for validation/logging when using local solc.',
  })
  @IsOptional()
  @IsString()
  compilerVersion?: string;

  @ApiProperty({
    required: false,
    type: () => [String],
    description:
      'Constructor arguments in order. Example for RewardToken: ["ipfs://.../{id}.json"]',
  })
  @IsOptional()
  @IsArray()
  constructorArgs?: any[];
}
