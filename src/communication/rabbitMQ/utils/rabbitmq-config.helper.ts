/**
 * Injects username, password, and vhost into a list of RabbitMQ URLs.
 *
 * @param urls - List of base RabbitMQ URLs (e.g., ['amqp://rabbitmq:5672'])
 * @param username - Username for authentication
 * @param password - Password for authentication
 * @param vhost - Virtual host
 * @returns List of updated URLs with credentials and vhost
 */
export function updateRabbitMQUrls(
  urls: string[],
  username: string,
  password: string,
  vhost: string,
): string[] {
  return urls.map((url) => {
    try {
      const parsedUrl = new URL(url);

      parsedUrl.username = username;
      parsedUrl.password = password;
      parsedUrl.pathname = `/${encodeURIComponent(vhost)}`;

      return parsedUrl.toString();
    } catch {
      throw new Error(`Invalid RabbitMQ URL: ${url}`);
    }
  });
}
