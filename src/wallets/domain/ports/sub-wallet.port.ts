import { Wallet } from '../wallet';

export interface SubWalletPort {
  /**
   * Provider identifier used to match wallet provider value.
   */
  readonly provider: Wallet['provider'];

  /**
   * Provision or return a blockchain address for the wallet.
   */
  createAddress?(wallet: Wallet): Promise<unknown>;

  /**
   * Fetch current balances for the wallet.
   */
  getBalance?(wallet: Wallet): Promise<unknown>;

  /**
   * Initiate a transfer for the wallet.
   */
  initiateTransfer?(wallet: Wallet, payload: unknown): Promise<unknown>;
}
