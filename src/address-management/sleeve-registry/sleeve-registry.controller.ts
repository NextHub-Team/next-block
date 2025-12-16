import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SleeveContractService } from './sleeve-contract.service';
import { ContractDeployerService } from '../contract-deployer/contract-deployer.service';
import { DeploySleeveDto } from './dto/deploy-sleeve.dto';
import { ethers } from 'ethers';
import { RegisterApiTag } from '../../common/api-docs/decorators/register-api-tag.decorator';


@RegisterApiTag(
  'Address Management',
  'Handle reward mint events and apply them to SleeveToken contracts',
)
@Controller('address-management/sleeves')
export class SleeveRegistryController {
  constructor(
    private readonly sleeves: SleeveContractService,
    private readonly deployer: ContractDeployerService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  list() {
    return this.sleeves.list();
  }

  @Post('deploy')
  @HttpCode(HttpStatus.CREATED)
  async deployAndRegister(@Body() dto: DeploySleeveDto) {
    const deployed = await this.deployer.deployContract('SleeveToken');
    this.sleeves.registerOrUpdate(dto.sleeveId, deployed.address);

    return {
      sleeveId: dto.sleeveId,
      contractAddress: deployed.address,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() body: { sleeveId: string; contractAddress: string }) {
    const addr = ethers.getAddress(String(body.contractAddress ?? '').trim());
    this.sleeves.registerOrUpdate(body.sleeveId, addr);
    return { ok: true };
  }
}
