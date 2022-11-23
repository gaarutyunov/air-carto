import { DynamicModule, Global, Module } from '@nestjs/common';

import { ICoreConfig } from './core.config';
import { CoreService } from './core.service';

@Global()
@Module({})
export class CoreModule {
	public static forRoot({ tables, collection }: ICoreConfig): DynamicModule {
		return {
			module: CoreModule,
			providers: [
				{
					provide: 'TABLES',
					useValue: tables,
				},
				{
					provide: 'COLLECTION',
					useValue: collection,
				},
				CoreService,
			],
			exports: ['TABLES', 'COLLECTION', CoreService],
		};
	}
}
