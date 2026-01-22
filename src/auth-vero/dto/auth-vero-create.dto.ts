import { PickType } from '@nestjs/swagger';
import { AuthVeroBulkCreateUserDto } from './auth-vero-bulk-create.dto';

export class AuthVeroCreateDto extends PickType(AuthVeroBulkCreateUserDto, [
  'email',
  'socialId',
  'firstName',
  'lastName',
] as const) {}
