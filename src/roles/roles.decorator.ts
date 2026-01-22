import { SetMetadata } from '@nestjs/common';

export function Roles(...roles: number[]) {
  return SetMetadata('roles', roles);
}
