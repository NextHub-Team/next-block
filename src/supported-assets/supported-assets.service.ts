import { Injectable } from '@nestjs/common';
import { CreateSupportedAssetDto } from './dto/create-supported-asset.dto';
import { UpdateSupportedAssetDto } from './dto/update-supported-asset.dto';
import { SupportedAssetRepository } from './infrastructure/persistence/supported-asset.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { SupportedAsset } from './domain/supported-asset';

@Injectable()
export class SupportedAssetsService {
	constructor(
		// Dependencies here
		private readonly supportedAssetRepository: SupportedAssetRepository,
	) {}

	async create(createSupportedAssetDto: CreateSupportedAssetDto) {
		// Do not remove comment below.
		// <creating-property />

		return this.supportedAssetRepository.create({
			// Do not remove comment below.
			// <creating-property-payload />
			protocol: createSupportedAssetDto.protocol,

			nativeAsset: createSupportedAssetDto.nativeAsset,

			issuerAddress: createSupportedAssetDto.issuerAddress,

			type: createSupportedAssetDto.type,

			decimals: createSupportedAssetDto.decimals,

			contractAddress: createSupportedAssetDto.contractAddress,

			blockchain: createSupportedAssetDto.blockchain,

			symbol: createSupportedAssetDto.symbol,

			name: createSupportedAssetDto.name,
		});
	}

	findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}) {
		return this.supportedAssetRepository.findAllWithPagination({
			paginationOptions: {
				page: paginationOptions.page,
				limit: paginationOptions.limit,
			},
		});
	}

	findById(id: SupportedAsset['id']) {
		return this.supportedAssetRepository.findById(id);
	}

	findByIds(ids: SupportedAsset['id'][]) {
		return this.supportedAssetRepository.findByIds(ids);
	}

	async update(
		id: SupportedAsset['id'],

		updateSupportedAssetDto: UpdateSupportedAssetDto,
	) {
		// Do not remove comment below.
		// <updating-property />

		return this.supportedAssetRepository.update(id, {
			// Do not remove comment below.
			// <updating-property-payload />
			protocol: updateSupportedAssetDto.protocol,

			nativeAsset: updateSupportedAssetDto.nativeAsset,

			issuerAddress: updateSupportedAssetDto.issuerAddress,

			type: updateSupportedAssetDto.type,

			decimals: updateSupportedAssetDto.decimals,

			contractAddress: updateSupportedAssetDto.contractAddress,

			blockchain: updateSupportedAssetDto.blockchain,

			symbol: updateSupportedAssetDto.symbol,

			name: updateSupportedAssetDto.name,
		});
	}

	remove(id: SupportedAsset['id']) {
		return this.supportedAssetRepository.remove(id);
	}
}
