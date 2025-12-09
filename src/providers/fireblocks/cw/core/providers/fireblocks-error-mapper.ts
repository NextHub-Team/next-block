import { Injectable, Logger } from '@nestjs/common';

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

  private isRateLimitError(error: any): boolean {
    return Boolean(error?.response?.status === 429);
  }

  private isPolicyRejection(error: any): boolean {
    return (
      error?.response?.data?.status === 'REJECTED' ||
      error?.response?.data?.code === 'POLICY_REJECTION'
    );
  }

  private isPendingPolicy(error: any): boolean {
    return error?.response?.data?.status === 'PENDING_AUTHORIZATION';
  }

  private isInvalidRequest(error: any): boolean {
    const status = error?.response?.status;
    return status === 400 || status === 404 || status === 422;
  }

  private resolveOutcome(error: unknown): FireblocksDomainOutcome {
    if (this.isRateLimitError(error)) {
      this.logger.warn('Fireblocks rate limit encountered');
      return 'RATE_LIMITED';
    }

    if (this.isPolicyRejection(error)) {
      this.logger.warn('Fireblocks request rejected by policy');
      return 'REQUEST_REJECTED_POLICY';
    }

    if (this.isPendingPolicy(error)) {
      return 'REQUEST_ACCEPTED_PENDING_POLICY';
    }

    if (this.isInvalidRequest(error)) {
      this.logger.error('Invalid Fireblocks request detected');
      return 'INVALID_REQUEST';
    }

    this.logger.warn('Transient Fireblocks upstream error detected');
    return 'TRANSIENT_UPSTREAM';
  }
}
