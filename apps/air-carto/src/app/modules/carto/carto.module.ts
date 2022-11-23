import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CartoService } from './carto.service';

@Module({
	imports: [
		HttpModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				baseURL: config.get('BASE_URL'),
				headers: {
					Authorization: `Bearer ${config.get('BEARER')}`,
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [CartoService],
	exports: [CartoService],
})
export class CartoModule {}
