import { Injectable, Logger } from '@nestjs/common';
import { FireblocksDomainOutcome } from '../../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';

@Injectable()
export class FireblocksResilienceService {
  private readonly logger = new Logger(FireblocksResilienceService.name);

  shouldOpenCircuit(outcome: FireblocksDomainOutcome): boolean {
    return outcome === 'RATE_LIMITED' || outcome === 'TRANSIENT_UPSTREAM';
  }

  shouldRetry(outcome: FireblocksDomainOutcome): boolean {
    if (outcome === 'REQUEST_REJECTED_POLICY') {
      this.logger.warn('Fireblocks request rejected by policy; will not retry.');
      return false;
    }

    if (outcome === 'INVALID_REQUEST') {
      this.logger.error('Fireblocks request is invalid; aborting retries.');
      return false;
    }

    if (outcome === 'SECURITY_EVENT') {
      this.logger.error('Security event detected; refusing to retry.');
      return false;
    }

    return outcome === 'RATE_LIMITED' || outcome === 'TRANSIENT_UPSTREAM';
  }

  buildBackoffDelay(attempt: number): number {
    const cappedAttempt = Math.min(attempt, 5);
    const delay = Math.pow(2, cappedAttempt) * 100;
    const jitter = Math.floor(Math.random() * 100);
    this.logger.debug(`Backoff attempt ${attempt}: delay ${delay + jitter}ms`);
    return delay + jitter;
  }

  async executeWithBackoff<T>(
    operation: () => Promise<T>,
    outcomeResolver: (error: unknown) => FireblocksDomainOutcome,
    maxRetries = 3,
  ): Promise<T> {
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        return await operation();
      } catch (error: unknown) {
        attempt += 1;
        const outcome = outcomeResolver(error);

        if (!this.shouldRetry(outcome) || attempt > maxRetries) {
          throw error;
        }

        const delay = this.buildBackoffDelay(attempt);
        this.logger.warn(`Retrying Fireblocks call after outcome ${outcome} (attempt ${attempt}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error('Fireblocks operation failed after retries');
  }

  recordSecurityEvent(context: string): void {
    this.logger.warn(`Security event detected: ${context}`);
  }
}
