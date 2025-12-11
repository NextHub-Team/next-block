import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ContractDeployerService } from './contract-deployer.service';
import { DeployContractDto } from './dto/deploy-contract.dto';
import {
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { DeployedContract } from './domain/deployed-contract';
import { RegisterApiTag } from '../../common/api-docs/decorators/register-api-tag.decorator';

@RegisterApiTag(
  'Address Management – Contract Deployer',
  'Compile and deploy address-book related smart contracts',
)
@Controller({
  path: 'address-management/contract-deployer',
//   version: '11',
})
export class ContractDeployerController {
  constructor(
    private readonly contractDeployerService: ContractDeployerService,
  ) {}

  @Post('deploy')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: DeployedContract,
  })
  async deploy(@Body() dto: DeployContractDto): Promise<DeployedContract> {
    return this.contractDeployerService.deployContract(
      dto.contractName,
      dto.compilerVersion,
    );
  }
}
