import { Permission } from '../../permissions/domain/permission';
import { Status } from '../../statuses/domain/status';
import { Role } from '../../roles/domain/role';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class AccessControl {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: () => Permission,
    nullable: true,
  })
  permission?: Permission | null;

  @ApiProperty({
    type: () => Status,
    nullable: true,
  })
  status?: Status | null;

  @ApiProperty({
    type: () => Role,
    nullable: false,
  })
  role: Role;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  user: User;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
