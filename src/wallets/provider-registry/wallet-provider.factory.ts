import {
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Wallet } from '../domain/wallet';
import { SubWalletPort } from '../domain/ports/sub-wallet.port';
import { TypeMessage } from '../../utils/types/message.type';
import { CryptoProviderEnum } from './crypto-provider.enum';

export const WALLET_PROVIDER_ADAPTERS = 'WALLET_PROVIDER_ADAPTERS';

@Injectable()
export class WalletProviderFactory {
  constructor(
    @Inject(WALLET_PROVIDER_ADAPTERS)
    private readonly adapters: SubWalletPort[],
  ) {
    this.registerProviders();
  }

  private registerProviders(): void {
    this.adapters.forEach((adapter) => {
      CryptoProviderEnum.register(adapter.provider);
    });
  }

  resolve(provider: Wallet['provider']): SubWalletPort | undefined {
    return this.adapters.find((adapter) => adapter.provider === provider);
  }

  validateProviderSupport(provider: Wallet['provider']): void {
    if (!this.adapters.length) {
      return;
    }

    const adapter = this.resolve(provider);
    if (!adapter) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { provider: 'WalletProviderNotSupported' },
      });
    }
  }

  getRegisteredProviders(): Wallet['provider'][] {
    return this.adapters.map((adapter) => adapter.provider);
  }
}
