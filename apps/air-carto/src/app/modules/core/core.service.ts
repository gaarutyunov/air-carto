import { BeforeApplicationShutdown, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CoreService implements BeforeApplicationShutdown {
	private readonly _logger = new Logger(CoreService.name);

	public beforeApplicationShutdown(signal?: string): void {
		this._logger.log(`Received signal: ${signal}. Shutting down...`);
	}
}
