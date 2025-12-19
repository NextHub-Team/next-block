import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthVeroService } from './auth-vero.service';
import { AuthVeroLoginDto } from './dto/auth-vero-login.dto';
import { LoginResponseDto } from '../auth/dto/login-response.dto';
import { AuthVeroBulkCreateDto } from './dto/auth-vero-bulk-create.dto';
import { AuthVeroBulkUpdateDto } from './dto/auth-vero-bulk-update.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { User } from '../users/domain/user';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';

@ApiTags('Auth')
@Controller({
  path: 'auth/vero',
  version: '1',
})
export class AuthVeroController {
  constructor(
    private readonly authService: AuthService,
    private readonly authVeroService: AuthVeroService,
  ) {}

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthVeroLoginDto): Promise<LoginResponseDto> {
    const { profile, exp } =
      await this.authVeroService.getProfileByToken(loginDto);
    return this.authService.validateSocialLogin(
      AuthProvidersEnum.vero,
      profile,
      exp,
    );
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiCreatedResponse({
    type: User,
    isArray: true,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('/register/bulk')
  @HttpCode(HttpStatus.CREATED)
  bulkCreateUsers(
    @Body() bulkCreateDto: AuthVeroBulkCreateDto,
  ): Promise<User[]> {
    return this.authVeroService.bulkCreateUsers(bulkCreateDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({
    type: User,
    isArray: true,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('/users/bulk')
  @HttpCode(HttpStatus.OK)
  bulkUpdateUsers(
    @Body() bulkUpdateDto: AuthVeroBulkUpdateDto,
  ): Promise<User[]> {
    return this.authVeroService.bulkUpdateUsers(bulkUpdateDto);
  }
}
