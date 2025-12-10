import { Injectable, Logger } from '@nestjs/common';
import {
  isInvalidRequest,
  isPendingPolicy,
  isPolicyRejection,
  isRateLimitError,
} from '../../../../fireblocks-cw.helper';

export type FireblocksDomainOutcome =
  | 'REQUEST_ACCEPTED_PENDING_POLICY'
  | 'REQUEST_REJECTED_POLICY'
  | 'RATE_LIMITED'
  | 'TRANSIENT_UPSTREAM'
  | 'INVALID_REQUEST'
  | 'SECURITY_EVENT';

@Injectable()
export class FireblocksErrorMapper {
  private readonly logger = new Logger(FireblocksErrorMapper.name);

  mapToDomainOutcome(error: unknown): FireblocksDomainOutcome {
    const outcome = this.resolveOutcome(error);
    this.logger.debug(`Mapped Fireblocks error to outcome ${outcome}`);
    return outcome;
  }

  private resolveOutcome(error: unknown): FireblocksDomainOutcome {
    if (isRateLimitError(error)) {
      this.logger.warn('Fireblocks rate limit encountered');
      return 'RATE_LIMITED';
    }

    if (isPolicyRejection(error)) {
      this.logger.warn('Fireblocks request rejected by policy');
      return 'REQUEST_REJECTED_POLICY';
    }

    if (isPendingPolicy(error)) {
      return 'REQUEST_ACCEPTED_PENDING_POLICY';
    }

    if (isInvalidRequest(error)) {
      this.logger.error('Invalid Fireblocks request detected');
      return 'INVALID_REQUEST';
    }

    this.logger.warn('Transient Fireblocks upstream error detected');
    return 'TRANSIENT_UPSTREAM';
  }
}
