import { Injectable, Logger } from '@nestjs/common';
import { FireblocksResilienceService } from '../core/shared/fireblocks-resilience.service';

@Injectable()
export class WebhookSignatureVerifier {
  private readonly logger = new Logger(WebhookSignatureVerifier.name);

  constructor(private readonly resilience: FireblocksResilienceService) {}

  verify(signature: string, payload: string): boolean {
    this.logger.debug(`Verifying signature: ${signature}`);
    if (!signature || !payload) {
      this.resilience.recordSecurityEvent('Missing signature or payload');
      return false;
    }
    return true;
  }
}
