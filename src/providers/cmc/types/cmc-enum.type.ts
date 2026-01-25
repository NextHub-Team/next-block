export enum CmcEnvironmentType {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production',
}

export enum CmcCategory {
  CRYPTOCURRENCY = 'cryptocurrency',
  EXCHANGE = 'exchange',
  GLOBAL_METRICS = 'global-metrics',
  TOOLS = 'tools',
  BLOCKCHAIN = 'blockchain',
  FIAT = 'fiat',
  PARTNERS = 'partners',
  KEY = 'key',
  CONTENT = 'content',
}

export enum CmcSortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum CmcListingStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNTRACKED = 'untracked',
  UNVERIFIED = 'unverified',
}

export enum CmcCryptoMapSort {
  CMC_RANK = 'cmc_rank',
  ID = 'id',
  MARKET_CAP = 'market_cap',
  NAME = 'name',
  SYMBOL = 'symbol',
}

export enum CmcCryptoListingsSort {
  MARKET_CAP = 'market_cap',
  NAME = 'name',
  SYMBOL = 'symbol',
  PRICE = 'price',
  VOLUME_24H = 'volume_24h',
  PERCENT_CHANGE_24H = 'percent_change_24h',
}

export enum CmcCryptocurrencyType {
  ALL = 'all',
  COINS = 'coins',
  TOKENS = 'tokens',
}
