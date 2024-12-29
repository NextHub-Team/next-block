import { Injectable, Logger } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class MailerService {
	private readonly transporter: nodemailer.Transporter;
	private readonly logger = new Logger(MailerService.name);
	private isConnected = false;

	constructor(private readonly configService: ConfigService<AllConfigType>) {
		this.transporter = nodemailer.createTransport({
			host: configService.get('mail.host', { infer: true }),
			port: configService.get('mail.port', { infer: true }),
			ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
			secure: configService.get('mail.secure', { infer: true }),
			requireTLS: configService.get('mail.requireTLS', { infer: true }),
			auth: {
				user: configService.get('mail.user', { infer: true }),
				pass: configService.get('mail.password', { infer: true }),
			},
		});

		// Log connection and disconnection events
		this.setupConnectionListeners();

		// Verify connection on service initialization
		this.verifyConnection().catch((err) =>
			this.logger.warn(
				`Initial connection verification failed: ${err.message}`,
			),
		);
	}

	private setupConnectionListeners(): void {
		// Listen for transport connection events (not native in nodemailer)
		this.transporter.on('idle', () => {
			if (!this.isConnected) {
				this.isConnected = true;
				this.logger.log('Connected to mail server.');
			}
		});

		this.transporter.on('error', (error) => {
			this.isConnected = false;
			this.logger.error(`Mail server error: ${error.message}`);
			this.logger.warn('Disconnected from mail server.');
		});
	}

	private async verifyConnection(): Promise<void> {
		try {
			this.logger.log('Verifying connection to the mail server...');
			await this.transporter.verify();
			this.isConnected = true;
			this.logger.log('Mail server is ready to accept messages.');
		} catch (error) {
			this.isConnected = false;
			this.logger.warn(
				`Mail server verification failed: ${error.message}. Reconnecting...`,
			);
			throw new Error(`SMTP server verification failed: ${error.message}`);
		}
	}

	async sendMail({
		templatePath,
		context,
		...mailOptions
	}: nodemailer.SendMailOptions & {
		templatePath: string;
		context: Record<string, unknown>;
	}): Promise<void> {
		let html: string | undefined;

		try {
			// Reading and compiling the template
			if (templatePath) {
				this.logger.log(`Reading email template from: ${templatePath}`);
				const template = await fs.readFile(templatePath, 'utf-8');
				html = Handlebars.compile(template, {
					strict: true,
				})(context);
				this.logger.log(`Template successfully compiled.`);
			}
		} catch (error) {
			this.logger.error(
				`Failed to read or compile template: ${templatePath}`,
				error.stack,
			);
			throw new Error(
				`Error reading or processing email template: ${error.message}`,
			);
		}

		try {
			// Sending the email
			const finalMailOptions = {
				...mailOptions,
				from: mailOptions.from
					? mailOptions.from
					: `"${this.configService.get('mail.defaultName', {
							infer: true,
						})}" <${this.configService.get('mail.defaultEmail', {
							infer: true,
						})}>`,
				html: mailOptions.html ? mailOptions.html : html,
			};

			this.logger.log(
				`Sending email to: ${finalMailOptions.to}, subject: ${finalMailOptions.subject}`,
			);

			await this.transporter.sendMail(finalMailOptions);
			this.logger.log(`Email sent successfully to: ${finalMailOptions.to}`);
		} catch (error) {
			this.logger.error(
				`Failed to send email to: ${mailOptions.to}`,
				error.stack,
			);

			// Warn about potential mail server issues
			if (error.code === 'ECONNECTION') {
				this.logger.warn('Mail server is unreachable. Reconnecting...');
				this.isConnected = false; // Mark as disconnected
			}

			throw new Error(`Error sending email: ${error.message}`);
		}
	}
}
