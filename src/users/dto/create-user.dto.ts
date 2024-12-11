import { UserLogDto } from '../../user-logs/dto/user-log.dto';

import { MainWalletDto } from '../../main-wallets/dto/main-wallet.dto';

import { PermissionDto } from '../../permissions/dto/permission.dto';

import { DeviceDto } from '../../devices/dto/device.dto';

import {
  // decorators here
  Transform,
  Type,
} from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  // decorators here
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusDto } from '../../statuses/dto/status.dto';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({
    required: false,
    type: () => [UserLogDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserLogDto)
  @IsArray()
  logs?: UserLogDto[] | null;

  @ApiProperty({
    required: false,
    type: () => [MainWalletDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MainWalletDto)
  @IsArray()
  mainWallets?: MainWalletDto[] | null;

  @ApiProperty({
    required: false,
    type: () => [PermissionDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PermissionDto)
  @IsArray()
  permissions?: PermissionDto[] | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiProperty({
    required: false,
    type: () => [DeviceDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceDto)
  @IsArray()
  devices?: DeviceDto[] | null;

  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty()
  lastName: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @ApiPropertyOptional({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;
}
