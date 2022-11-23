import { context, trace } from '@opentelemetry/api';
import { OpenTelemetryModule } from 'nestjs-otel';
import { LoggerModule } from 'nestjs-pino';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { environment } from '../environments/environment';
import { SpatialModule, StatisticsModule, TimeSeriesModule } from './modules';
import { CoreModule } from './modules/core/core.module';
import { MapperModule } from './modules/mapper/mapper.module';

@Module({
	imports: [
		MapperModule,
		StatisticsModule,
		SpatialModule,
		TimeSeriesModule,
		ConfigModule.forRoot({
			envFilePath: environment.envFilePath,
			isGlobal: true,
		}),
		CoreModule.forRoot(environment),
		LoggerModule.forRoot({
			pinoHttp: {
				formatters: {
					log: (object) => {
						const span = trace.getSpan(context.active());
						if (!span) return { ...object };

						const { spanId, traceId } = span.spanContext();

						return { ...object, spanId, traceId };
					},
				},
			},
		}),
		OpenTelemetryModule.forRoot({
			metrics: {
				hostMetrics: true,
				apiMetrics: {
					enable: true,
				},
			},
		}),
	],
})
export class AppModule {}
