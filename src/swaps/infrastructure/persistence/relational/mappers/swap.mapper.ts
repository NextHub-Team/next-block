import { Swap } from '../../../../domain/swap.entity';
import { SwapRelationalEntity } from '../entities/swap-relational.entity';

export class SwapMapper {
  static toDomain(entity: SwapRelationalEntity): Swap {
    return {
      sellToken: entity.sellToken,
      buyToken: entity.buyToken,
      sellAmount: entity.sellAmount,
      price: entity.result,
    };
  }

  static toPersistence(swap: Swap): SwapRelationalEntity {
    return {
      id: 0,
      sellToken: swap.sellToken,
      buyToken: swap.buyToken,
      sellAmount: swap.sellAmount,
      result: swap.price,
    };
  }
}
