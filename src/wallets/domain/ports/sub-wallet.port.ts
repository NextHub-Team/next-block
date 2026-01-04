import { Wallet } from '../wallet';

export interface SubWalletPort {
  /**
   * Provider identifier used to match wallet provider value.
   */
  readonly provider: Wallet['provider'];

  /**
   * Fetch current balances for the wallet.
   */
  getBalance?(wallet: Wallet): Promise<unknown>;

  /**
   * Fetch the address associated with the wallet.
   */
  getAddress?(wallet: Wallet): Promise<string>;
}
