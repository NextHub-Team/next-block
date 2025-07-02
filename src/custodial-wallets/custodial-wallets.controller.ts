import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { CustodialWalletsService } from './custodial-wallets.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CustodialWallet } from './domain/custodial-wallet';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Custodialwallets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'custodial-wallets',
  version: '1',
})
export class CustodialWalletsController {
  constructor(
    private readonly custodialWalletsService: CustodialWalletsService,
  ) {}

  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CustodialWallet,
    description: 'Creates or retrieves custodial wallet for current user',
  })
  async createOrGetMyWallet(@Request() req) {
    return this.custodialWalletsService.createOrGetWallet(req.user.id);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CustodialWallet,
    isArray: true,
    description: 'Returns custodial wallets for current user',
  })
  @ApiNotFoundResponse({
    description: 'No custodial wallets found for this user',
  })
  async findAllByMe(@Request() req): Promise<CustodialWallet[]> {
    return this.custodialWalletsService.findByMe(req.user.id);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CustodialWallet,
  })
  findById(@Param('id') id: string) {
    return this.custodialWalletsService.findById(id);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.custodialWalletsService.remove(id);
  }

  @Get('resolve-address/:socialId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Resolved address from Fireblocks using socialId(s)',
  })
  async resolveAddressBySocialId(@Param('socialId') socialId: string) {
    const ids = socialId.includes(',')
      ? socialId.split(',').map((id) => id.trim())
      : socialId;
    return this.custodialWalletsService.resolveAddressBySocialId(ids);
  }
}
