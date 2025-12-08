import { Wallet } from '../domain/wallet';

/**
 * Dynamic enum-like registry for supported crypto wallet providers.
 * Providers should call `CryptoProviderEnum.register()` during setup so
 * services and controllers can reference the canonical provider list.
 */
export class CryptoProviderEnum {
  private static providers = new Map<string, Wallet['provider']>();

  private static normalizeKey(provider: Wallet['provider']): string {
    return provider.toString().toUpperCase().replace(/[^A-Z0-9]/g, '_');
  }

  static register(provider: Wallet['provider']): void {
    const key = this.normalizeKey(provider);
    this.providers.set(key, provider);
  }

  static values(): Wallet['provider'][] {
    return Array.from(this.providers.values());
  }

  static toRecord(): Record<string, Wallet['provider']> {
    return Object.fromEntries(this.providers);
  }

  static has(provider: Wallet['provider']): boolean {
    return this.values().includes(provider);
  }
}
