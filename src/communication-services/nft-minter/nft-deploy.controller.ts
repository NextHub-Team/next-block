import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { NftDeployService } from './services/nft-deploy.service';

import { IsString } from 'class-validator';

export class DeployRequestDto {
  @IsString()
  name: string;

  @IsString()
  symbol: string;
}

export class DeployResponseDto {
  contractAddress: string;
}

@ApiTags('NFT')
@Controller({
  path: 'nft',
  version: '1',
})
export class NftDeployController {
  constructor(private readonly deployService: NftDeployService) {}

  @Post('deploy-contract')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: DeployRequestDto,
    description: 'NFT contract deployment parameters (name & symbol)',
    examples: {
      example1: {
        summary: 'Deploy MyAwesomeNFT',
        value: {
          name: 'MyAwesomeNFT',
          symbol: 'AWNFT',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Successfully deployed NFT contract',
    type: DeployResponseDto,
    schema: {
      example: {
        contractAddress: '0xB1bF38D33a16efA2cA98B6df8F5aabEb570C80Ca',
      },
    },
  })
  async deployContract(
    @Body() body: DeployRequestDto,
  ): Promise<DeployResponseDto> {
    const address = await this.deployService.deploy(body.name, body.symbol);
    return { contractAddress: address };
  }
}
