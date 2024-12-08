import { Passphrase } from '../../passphrases/domain/passphrase';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class MainWallet {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  address: string;

  @ApiProperty({
    type: () => Passphrase,
    nullable: false,
  })
  passphrase: Passphrase;

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
