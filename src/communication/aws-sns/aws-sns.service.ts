import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AwsSnsService {
  private readonly logger = new Logger(AwsSnsService.name);

  /**
   * Extracts subject and payload from raw SNS-over-SQS message.
   */
  deserialize(rawBody: string): { subject: string; data: any } {
    try {
      const outer = JSON.parse(rawBody); // SQS layer
      const envelope =
        typeof outer.Message === 'string' ? JSON.parse(outer.Message) : outer;
      const subject = envelope.Subject || outer.Subject || 'default';

      const payload = envelope.Message;
      const data =
        typeof payload === 'string'
          ? (this.tryParseJson(payload) ?? payload)
          : payload;

      return { subject, data };
    } catch (err) {
      this.logger.error('Failed to deserialize SNS message', err);
      throw err;
    }
  }

  private tryParseJson(raw: string): any | null {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Filter or validate the payload before routing.
   * You can extend this with class-validator or Joi schemas.
   */
  filter(data: any): any {
    // Placeholder for transformation or validation
    return data;
  }

  /**
   * Save the message to a database or event store.
   * Extend this to persist messages (e.g. to StarRocks, PostgreSQL).
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  save(subject: string, data: any): void {
    this.logger.debug(`Saving message [${subject}]`);
    // TODO: Implement actual DB persistence
  }

  /**
   * Optional method to fetch saved data (not required for SNS).
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(id: string): any {
    // TODO: Lookup logic if needed
    return null;
  }
}
