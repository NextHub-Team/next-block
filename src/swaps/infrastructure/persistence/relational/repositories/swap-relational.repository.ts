import { Injectable } from '@nestjs/common';
import { SwapRepository } from '../../../../domain/ports/swap.repository';

@Injectable()
export class SwapRelationalRepository implements SwapRepository {
  async save(data: any): Promise<void> {
    console.log('Saving to DB...', data);
  }
}
