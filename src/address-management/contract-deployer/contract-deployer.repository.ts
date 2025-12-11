import { DeployedContract } from './domain/deployed-contract';
import { NullableType } from '../../utils/types/nullable.type';
import { IPaginationOptions } from '../../utils/types/pagination-options';

export abstract class ContractDeployerRepository {
  abstract save(entity: DeployedContract): Promise<DeployedContract>;

  abstract findByAddress(
    address: DeployedContract['address'],
  ): Promise<NullableType<DeployedContract>>;

  abstract findAllWithPagination(options: {
    paginationOptions: IPaginationOptions;
  }): Promise<DeployedContract[]>;
}
