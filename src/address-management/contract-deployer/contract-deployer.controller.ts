import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContractDeployerService } from './contract-deployer.service';
import { DeployContractDto } from './dto/deploy-contract.dto';
import { DeployedContract } from './domain/deployed-contract';
import { writeSleeve } from './sleeve-store';

@ApiTags('Address Management')
@Controller('address-management/contract-deployer')
export class ContractDeployerController {
  constructor(private readonly contractDeployerService: ContractDeployerService) {}

  @Post('deploy')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Deploy Solidity contract and register sleeveId',
    description:
      'Deploys the given Solidity contract and stores sleeveId',
  })
  @ApiBody({
    type: DeployContractDto,
    examples: {
      request: {
        summary: 'Required request body',
        value: {
          contractName: 'SleeveToken',
          constructorArgs: [],
          sleeveId: 'sleeveId',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: DeployedContract })
  async deploy(@Body() dto: DeployContractDto): Promise<DeployedContract> {
    const deployed = await this.contractDeployerService.deployContract(
      dto.contractName,
      undefined,
      dto.constructorArgs ?? [],
    );

   
    writeSleeve(dto.sleeveId, deployed.address);

    return deployed;
  }
}
