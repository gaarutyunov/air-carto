import { Module } from '@nestjs/common';

import { CartoModule } from '../carto';
import { SqlApiService } from './sql-api.service';

@Module({
	imports: [CartoModule],
	providers: [SqlApiService],
	exports: [SqlApiService],
})
export class SqlApiModule {}
