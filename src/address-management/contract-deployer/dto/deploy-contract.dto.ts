import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeployContractDto {
  @ApiProperty({
    required: true,
    type: () => String,
    description: 'Solidity contract name without .sol extension (e.g. ContactBook)',
  })
  @IsString()
  contractName: string;

  @ApiProperty({
    required: false,
    type: () => String,
    description: 'Solidity compiler version (e.g. 0.8.28). Defaults to 0.8.28 if not provided.',
  })
  @IsOptional()
  @IsString()
  compilerVersion?: string;
}
