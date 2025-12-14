import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookSignatureVerifier {
  private readonly logger = new Logger(WebhookSignatureVerifier.name);

  verify(signature: string, payload: string): boolean {
    this.logger.debug(`Verifying signature: ${signature}`);
    if (!signature || !payload) {
      this.logger.warn('Missing signature or payload for Fireblocks webhook');
      return false;
    }
    return true;
  }
}
