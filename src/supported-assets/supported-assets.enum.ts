import { createEnum } from '../../src/utils/types/helper.type';

export const AssetTypeEnum = createEnum(['native', 'token']);
export const AssetProtocol = createEnum([
  'ERC20',
  'ERC721',
  'SPL',
  'SOL_ASSET',
]);
