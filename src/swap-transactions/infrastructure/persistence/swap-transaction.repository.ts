import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { SwapTransaction } from '../../domain/swap-transaction';

export abstract class SwapTransactionRepository {
	abstract create(
		data: Omit<SwapTransaction, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<SwapTransaction>;

	abstract findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<SwapTransaction[]>;

	abstract findById(
		id: SwapTransaction['id'],
	): Promise<NullableType<SwapTransaction>>;

	abstract findByIds(ids: SwapTransaction['id'][]): Promise<SwapTransaction[]>;

	abstract update(
		id: SwapTransaction['id'],
		payload: DeepPartial<SwapTransaction>,
	): Promise<SwapTransaction | null>;

	abstract remove(id: SwapTransaction['id']): Promise<void>;
}
