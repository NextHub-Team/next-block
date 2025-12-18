import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeployContractDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Solidity contract name without .sol extension (e.g. SleeveToken)',
    example: 'SleeveToken',
  })
  @IsString()
  @IsNotEmpty()
  contractName: string;

  @ApiProperty({
    required: true,
    type: [Object],
    description: 'Constructor arguments in order (can be empty array).',
    example: [],
  })
  @IsArray()
  constructorArgs: any[];

  @ApiProperty({
    required: true,
    type: String,
    description: 'Required. Will be stored as sleeveId -> contractAddress in JSON store.',
    example: 'test-sleeve-5',
  })
  @IsString()
  @IsNotEmpty()
  sleeveId: string;
}
