import { LogLevel } from '@nestjs/common';

export type BaseLogLevel = LogLevel; // ['log', 'error', 'warn', 'debug', 'verbose']
export type AppLogLevel = 'info' | 'trace' | BaseLogLevel;

export interface LogMessage {
	timestamp: string; // ISO string for the log timestamp
	level: BaseLogLevel | AppLogLevel; // Log level
	context?: string; // Optional context for the log (e.g., class or function name)
	message: string; // The log message
	data?: Record<string, any>; // Additional metadata (optional)
}
export interface LoggerConfig {
	level: BaseLogLevel | AppLogLevel; // Minimum log level to display
	timestampFormat?: string; // e.g., 'YYYY-MM-DD HH:mm:ss'
	jsonFormat?: boolean; // Whether logs should be output in JSON format
	logToFile?: boolean; // Enable logging to file
	filePath?: string; // File path for log storage
}

export enum LogContextEnum {
	DATABASE = 'Database',
	AUTH = 'Authentication',
	HTTP = 'HttpRequest',
	SERVICE = 'Service',
	CONTROLLER = 'Controller',
	APP = 'Application',
	UTILS = 'Utilities',
	CONFIG = 'Configuration',
	MAIL = 'Mail',
	NOTIFICATION = 'Notification',
}
export enum LogLevelEnum {
	LOG = 'log',
	ERROR = 'error',
	WARN = 'warn',
	DEBUG = 'debug',
	VERBOSE = 'verbose',
	INFO = 'info',
	TRACE = 'trace',
}

export enum EnvironmentEnum {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
	STAGING = 'staging',
}
