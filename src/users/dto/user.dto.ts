import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {
  @ApiProperty({
    type: String,
    example: 'userId',
  })
  @IsNotEmpty()
  id: string | number;
}

export class UserEventDto {
  constructor(init?: Partial<UserEventDto>) {
    Object.assign(this, init);
  }

  @ApiProperty({
    type: String,
    example: 'user-id-or-number',
    description: 'User identifier related to the event.',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    type: String,
    example: 'vero',
    description: 'Auth provider that triggered the event.',
  })
  @IsNotEmpty()
  @IsString()
  provider: string;

  @ApiPropertyOptional({
    type: String,
    example: 'abc-social-id',
    description: 'External social identifier if available.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  socialId?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'john.doe@example.com',
    description: 'Email associated with the user.',
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'John',
    description: 'First name of the user.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Doe',
    description: 'Last name of the user.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00.000Z',
    description: 'Deletion timestamp when the event represents a removal.',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  deletedAt?: string;
}
