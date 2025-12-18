export type QueueDashConfig = {
  enable: boolean;
  /**
   * Path segment or absolute path for the mounted QueueDash API.
   * - If relative (no leading `/`), it will be mounted under `/${app.apiPrefix}`.
   * - If absolute (starts with `/`), it will be mounted as-is.
   */
  path: string;
  allowBatching: boolean;
  logRequests: boolean;
};
