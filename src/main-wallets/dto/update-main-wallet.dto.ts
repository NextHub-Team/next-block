// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateMainWalletDto } from './create-main-wallet.dto';

export class UpdateMainWalletDto extends PartialType(CreateMainWalletDto) {}