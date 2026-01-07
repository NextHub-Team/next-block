import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetRegistryEntity } from '../../../../asset-registries/infrastructure/persistence/relational/entities/asset-registry.entity';
import { In, Repository } from 'typeorm';
import {
  AssetRegistryEnvType,
  AssetRegistryProviderName,
} from '../../../../asset-registries/types/asset-registry-enum.type';

@Injectable()
export class AssetRegistrySeedService {
  constructor(
    @InjectRepository(AssetRegistryEntity)
    private repository: Repository<AssetRegistryEntity>,
  ) {}

  async run() {
    const fireblocksAvaxAssets: Array<Partial<AssetRegistryEntity>> = [
      {
        description: 'Fireblocks Avalanche C-Chain native AVAX (mainnet)',
        providerName: AssetRegistryProviderName.FIREBLOCKS,
        envType: AssetRegistryEnvType.MAINNET,
        chainName: 'avalanche-c-chain',
        assetId: 'AVAX',
      },
      {
        description: 'Fireblocks Avalanche Fuji native AVAX (testnet)',
        providerName: AssetRegistryProviderName.FIREBLOCKS,
        envType: AssetRegistryEnvType.TESTNET,
        chainName: 'avalanche-fuji',
        assetId: 'AVAXTEST',
      },
    ];

    const existingAssets = await this.repository.find({
      where: {
        assetId: In(fireblocksAvaxAssets.map((asset) => asset.assetId)),
      },
    });

    const existingAssetIds = new Set(
      existingAssets.map((asset) => asset.assetId),
    );
    const toCreate = fireblocksAvaxAssets
      .filter((asset) => asset.assetId && !existingAssetIds.has(asset.assetId))
      .map((asset) => this.repository.create(asset));

    if (toCreate.length > 0) {
      await this.repository.save(toCreate);
    }
  }
}
