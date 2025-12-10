import { Logger } from '@nestjs/common';

export abstract class AbstractAdminService {
  protected readonly logger: Logger;

  protected constructor(context: string) {
    this.logger = new Logger(context);
  }

  protected logAction(message: string): void {
    this.logger.log(message);
  }

  protected debug(message: string): void {
    this.logger.debug(message);
  }
}
