import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
  TooManyRequestsException,
} from '@nestjs/common';
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

  toHttpException(error: unknown, fallback = 'Fireblocks request failed'): HttpException {
    const outcome = this.mapToDomainOutcome(error);
    const message = this.extractMessage(error) ?? fallback;

    switch (outcome) {
      case 'RATE_LIMITED':
        return new TooManyRequestsException(message);
      case 'REQUEST_REJECTED_POLICY':
        return new ForbiddenException(message);
      case 'INVALID_REQUEST':
        return new BadRequestException(message);
      case 'REQUEST_ACCEPTED_PENDING_POLICY':
        return new ServiceUnavailableException(
          `${message} (pending policy approval)`,
        );
      case 'SECURITY_EVENT':
        return new ForbiddenException(`${message} (security event)`);
      default:
        return new InternalServerErrorException(message);
    }
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

  private extractMessage(error: unknown): string | undefined {
    if (error instanceof Error) {
      return error.message;
    }

    const response = (error as any)?.response;
    return response?.data?.message ?? response?.statusText ?? response?.data?.title;
  }
}
