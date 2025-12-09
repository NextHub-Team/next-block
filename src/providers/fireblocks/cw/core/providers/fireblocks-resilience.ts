import { Injectable, Logger } from '@nestjs/common';
import { FireblocksDomainOutcome } from './fireblocks-error-mapper';

@Injectable()
export class FireblocksResilience {
  private readonly logger = new Logger(FireblocksResilience.name);

  shouldOpenCircuit(outcome: FireblocksDomainOutcome): boolean {
    return outcome === 'RATE_LIMITED' || outcome === 'TRANSIENT_UPSTREAM';
  }

  buildBackoffDelay(attempt: number): number {
    const cappedAttempt = Math.min(attempt, 5);
    const delay = Math.pow(2, cappedAttempt) * 100;
    const jitter = Math.floor(Math.random() * 100);
    this.logger.debug(`Backoff attempt ${attempt}: delay ${delay + jitter}ms`);
    return delay + jitter;
  }

  recordSecurityEvent(context: string): void {
    this.logger.warn(`Security event detected: ${context}`);
  }
}
