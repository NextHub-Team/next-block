import { Inject, Logger } from '@nestjs/common';
import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';

import { AwsSnsService } from './aws-sns.service';
import { AWS_SNS_CONSUMER_OPTIONS } from './types/aws-sns-const.type';
import { AwsSnsConfig } from './config/aws-sns-config.type';

export class AwsSnsStrategy extends Server implements CustomTransportStrategy {
  private readonly strategyLogger = new Logger(AwsSnsStrategy.name);
  private readonly sqsClient: SQSClient;
  private pollingTimer: NodeJS.Timeout | null = null;
  private shouldRun = false;
  private pollInProgress = false;

  constructor(
    @Inject(AWS_SNS_CONSUMER_OPTIONS)
    private readonly options: AwsSnsConfig,

    private readonly snsService: AwsSnsService,
  ) {
    super();
    this.sqsClient = new SQSClient({ region: this.options.awsRegion });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async listen(callback: () => void): Promise<void> {
    if (!this.options.enableAwsSns) {
      this.strategyLogger.warn('AWS SNS consumer is disabled. Skipping start.');
      callback();
      return;
    }

    if (!this.options.sqsQueueUrl?.trim()) {
      this.strategyLogger.error(
        'AWS SNS queueUrl is not configured. Skipping start.',
      );
      callback();
      return;
    }

    this.strategyLogger.log(
      `SNS strategy started. Listening on SQS queue: ${this.options.sqsQueueUrl}`,
    );
    this.startPolling();
    callback();
  }

  async close(): Promise<void> {
    this.shouldRun = false;
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
      this.strategyLogger.log('SNS strategy polling stopped.');
    }

    while (this.pollInProgress) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  private startPolling(): void {
    const {
      sqsQueueUrl,
      sqsPollingInterval = 3000,
      sqsMaxMessages = 10,
      sqsVisibilityTimeout = 30,
      sqsWaitTimeSeconds = 10,
    } = this.options;

    this.shouldRun = true;
    this.pollingTimer = setInterval(async () => {
      if (!this.shouldRun || this.pollInProgress) {
        return;
      }

      this.pollInProgress = true;

      try {
        const response = await this.sqsClient.send(
          new ReceiveMessageCommand({
            QueueUrl: sqsQueueUrl,
            MaxNumberOfMessages: sqsMaxMessages,
            VisibilityTimeout: sqsVisibilityTimeout,
            WaitTimeSeconds: sqsWaitTimeSeconds,
          }),
        );

        const messages = response.Messages || [];
        if (messages.length > 0) {
          this.strategyLogger.debug(
            `Received ${messages.length} message(s) from SQS`,
          );
        }

        for (const msg of messages) {
          try {
            if (!msg.Body) {
              this.strategyLogger.warn(
                'Received SQS message without body. Skipping.',
              );
              continue;
            }

            const { subject, data } = this.snsService.deserialize(msg.Body);
            const filtered = this.snsService.filter(data);

            const handler = this.getHandlerByPattern(subject);
            if (!handler) {
              this.strategyLogger.warn(
                `No handler found for subject: "${subject}"`,
              );
              continue;
            }

            await handler(filtered);

            this.snsService.save(subject, filtered);

            await this.sqsClient.send(
              new DeleteMessageCommand({
                QueueUrl: sqsQueueUrl,
                ReceiptHandle: msg.ReceiptHandle!,
              }),
            );
          } catch (err) {
            this.strategyLogger.error('Error while processing message', err);
          }
        }
      } catch (err) {
        this.strategyLogger.error('SQS polling failed', err);
      } finally {
        this.pollInProgress = false;
      }
    }, sqsPollingInterval);
  }

  // Required by Server base class; not used by this transport.
  on<T = any>(): Promise<T> {
    return Promise.resolve(null as T);
  }

  // Required by Server base class; SNS handlers already receive parsed data.
  unwrap<T = any>(): T {
    return null as T;
  }
}
