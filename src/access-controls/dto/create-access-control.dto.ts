import { PermissionDto } from '../../permissions/dto/permission.dto';
import { StatusDto } from '../../statuses/dto/status.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateAccessControlDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: false,
    type: () => PermissionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PermissionDto)
  @IsNotEmptyObject()
  permission?: PermissionDto | null;

  @ApiProperty({
    required: false,
    type: () => StatusDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StatusDto)
  @IsNotEmptyObject()
  status?: StatusDto | null;

  @ApiProperty({
    required: true,
    type: () => RoleDto,
  })
  @ValidateNested()
  @Type(() => RoleDto)
  @IsNotEmptyObject()
  role: RoleDto;

  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
