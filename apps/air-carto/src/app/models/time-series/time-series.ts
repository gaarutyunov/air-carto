import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { Statistic } from '../statistics/statistic';

/**
 * Aggregated statistic over a time period
 */
export class TimeSeries extends Statistic {
	@ApiProperty({
		name: 'period',
		description: 'Time period for aggregation',
		type: 'string',
		format: 'date-time',
	})
	@AutoMap()
	@Type(() => Date)
	public period: Date;
}
