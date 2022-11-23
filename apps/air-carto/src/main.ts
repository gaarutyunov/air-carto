/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import {
	ClassSerializerInterceptor,
	ShutdownSignal,
	ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { otelSDK } from './telemetry';

async function bootstrap() {
	// telemetry
	await otelSDK.start();

	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	const globalPrefix = 'api';

	// middleware
	app.useLogger(app.get(Logger));
	app.useGlobalInterceptors(
		new ClassSerializerInterceptor(app.get(Reflector)),
		new LoggerErrorInterceptor()
	);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);

	app.setGlobalPrefix(globalPrefix)
		.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT])
		.enableCors(environment.cors);

	function stop() {
		otelSDK
			.shutdown()
			.then(() => app.get(Logger).log('telemetry stopped'))
			.catch((error) => app.get(Logger).error(error))
			.finally(() => process.exit(0));
	}

	process.on('SIGTERM', stop);
	process.on('SIGINT', stop);

	// docs
	const config = new DocumentBuilder()
		.setTitle('air-carto')
		.setDescription('CARTO air quality API')
		.setVersion('1.0')
		.addTag('CARTO')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(globalPrefix, app, document);

	// start
	const port = process.env.PORT || 3333;
	await app.listen(port);

	app.get(Logger).log(
		`Application is running on: http://localhost:${port}/${globalPrefix}`
	);
}

bootstrap();
