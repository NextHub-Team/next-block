import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Passphrase } from '../../domain/passphrase';

export abstract class PassphraseRepository {
	abstract create(
		data: Omit<Passphrase, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<Passphrase>;

	abstract findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<Passphrase[]>;

	abstract findById(id: Passphrase['id']): Promise<NullableType<Passphrase>>;
	abstract findByIds(ids: Passphrase['id'][]): Promise<Passphrase[]>;

	abstract update(
		id: Passphrase['id'],
		payload: DeepPartial<Passphrase>,
	): Promise<Passphrase | null>;

	abstract remove(id: Passphrase['id']): Promise<void>;
}
