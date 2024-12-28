import { registerAs } from '@nestjs/config';
import { ZeroxConfig } from './zerox-config.type';

export default registerAs(
	'zerox',
	(): ZeroxConfig => ({
		apiKey: process.env.ZEROX_API_KEY || '',
		apiUrl: process.env.ZEROX_API_URL || 'https://api.0x.org/swap/v1',
	}),
);
