import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthVeroBulkUpdateUserDto {
  @ApiProperty({ example: '0a7346d0-4611-11ef-8342' })
  @IsString()
  @IsNotEmpty()
  socialId: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;
}

export class AuthVeroBulkUpdateDto {
  @ApiProperty({ type: () => [AuthVeroBulkUpdateUserDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AuthVeroBulkUpdateUserDto)
  users: AuthVeroBulkUpdateUserDto[];
}
