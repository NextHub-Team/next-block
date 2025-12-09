import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';
import { FireblocksResilience } from '../core/providers/fireblocks-resilience';

@Injectable()
export class WebhookSignatureVerifier {
  private readonly logger = new Logger(WebhookSignatureVerifier.name);

  constructor(private readonly resilience: FireblocksResilience) {}

  verifySignature(rawBody: Buffer, signatureHeader?: string): void {
    if (!signatureHeader) {
      this.logger.warn('Webhook signature header missing');
      this.resilience.recordSecurityEvent('Missing webhook signature');
      throw new UnauthorizedException('Missing signature');
    }

    this.logger.debug('Verifying webhook signature');
    const expected = createHash('sha256').update(rawBody).digest();
    const provided = Buffer.from(signatureHeader, 'hex');

    if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
      this.logger.error('Webhook signature mismatch');
      this.resilience.recordSecurityEvent('Webhook signature mismatch');
      throw new UnauthorizedException('Invalid signature');
    }

    this.logger.log('Webhook signature verified successfully');
  }
}
