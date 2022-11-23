import { Module } from '@nestjs/common';

import { SqlApiModule } from '../sql-api';
import { SqlBuilderModule } from '../sql-builder';
import { TimeSeriesController } from './time-series.controller';
import { TimeSeriesService } from './time-series.service';

@Module({
	imports: [SqlApiModule, SqlBuilderModule],
	providers: [TimeSeriesService],
	controllers: [TimeSeriesController],
})
export class TimeSeriesModule {}
