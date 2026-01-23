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
import { lowerCaseTransformer } from '../../utils/transformers/string.transformer';

export class AuthVeroBulkCreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '0a7346d0-4611-11ef-8342' })
  @IsString()
  @IsNotEmpty()
  socialId: string;

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

export class AuthVeroBulkCreateDto {
  @ApiProperty({ type: () => [AuthVeroBulkCreateUserDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AuthVeroBulkCreateUserDto)
  users: AuthVeroBulkCreateUserDto[];
}
