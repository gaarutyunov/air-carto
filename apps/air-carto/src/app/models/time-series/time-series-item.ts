import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { StatisticsItem } from '../statistics/statistics-item';
import { TimeSeries } from './time-series';

/**
 * Aggregated statistics item over a time period
 */
export class TimeSeriesItem extends StatisticsItem {
	@ApiProperty({
		name: 'statistics',
		description: 'Statistics array',
		type: TimeSeries,
		isArray: true,
	})
	@AutoMap(() => [TimeSeries])
	@Type(() => TimeSeries)
	public override statistics: TimeSeries[]; // this override is necessary to redefine decorators and type
}
