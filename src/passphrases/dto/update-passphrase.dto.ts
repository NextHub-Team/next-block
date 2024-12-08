// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatePassphraseDto } from './create-passphrase.dto';

export class UpdatePassphraseDto extends PartialType(CreatePassphraseDto) {}
