import { Module } from '@nestjs/common';

import { SqlApiModule } from '../sql-api';
import { SqlBuilderModule } from '../sql-builder';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
	imports: [SqlApiModule, SqlBuilderModule],
	controllers: [StatisticsController],
	providers: [StatisticsService],
})
export class StatisticsModule {}
