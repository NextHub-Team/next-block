export type AwsSnsConfig = {
  /**
   * Whether SNS/SQS consumer is enabled.
   * Default: false
   */
  enableAwsSns: boolean;

  /**
   * AWS region used to configure SNS and SQS clients.
   */
  awsRegion: string;

  /**
   * Full URL of the SQS queue subscribed to an SNS topic.
   */
  sqsQueueUrl: string;

  /**
   * Message polling interval in milliseconds.
   * Default: 3000
   */
  sqsPollingInterval: number;

  /**
   * Max number of messages per poll.
   * Default: 10
   */
  sqsMaxMessages: number;

  /**
   * Message visibility timeout in seconds.
   * Default: 30
   */
  sqsVisibilityTimeout: number;

  /**
   * Long polling wait time in seconds.
   * Default: 10
   */
  sqsWaitTimeSeconds: number;
};
