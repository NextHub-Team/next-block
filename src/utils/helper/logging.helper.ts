import { LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentEnum } from '../types/logging.type';

export function getLogLevels(configService: ConfigService): LogLevel[] {
	// Get the EnvironmentEnum from ConfigService or default to 'development'
	const env =
		configService.get<EnvironmentEnum>('NODE_ENV', { infer: true }) ||
		EnvironmentEnum.DEVELOPMENT;

	// Determine log levels based on the EnvironmentEnum
	switch (env) {
		case EnvironmentEnum.PRODUCTION:
			return ['error', 'warn'];
		case EnvironmentEnum.STAGING:
			return ['log', 'error', 'warn', 'verbose'];
		case EnvironmentEnum.DEVELOPMENT:
		default:
			return ['log', 'error', 'warn', 'debug', 'verbose'];
	}
}
