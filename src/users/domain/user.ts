import { AccessControl } from '../../access-controls/domain/access-control';
import { UserLog } from '../../user-logs/domain/user-log';
import { MainWallet } from '../../main-wallets/domain/main-wallet';
import { Device } from '../../devices/domain/device';
import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { ApiProperty } from '@nestjs/swagger';

const idType = Number;

export class User {
  @ApiProperty({
    type: () => AccessControl,
    nullable: true,
  })
  abilities?: AccessControl | null;

  @ApiProperty({
    type: () => [UserLog],
    nullable: true,
  })
  logs?: UserLog[] | null;

  @ApiProperty({
    type: () => [MainWallet],
    nullable: true,
  })
  mainWallets?: MainWallet[] | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
    example: '+13847923742',
  })
  phone?: string | null;

  @ApiProperty({
    type: () => [Device],
    nullable: true,
  })
  devices?: Device[] | null;

  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({
    type: String,
    example: 'email',
  })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: () => FileType,
  })
  photo?: FileType | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
