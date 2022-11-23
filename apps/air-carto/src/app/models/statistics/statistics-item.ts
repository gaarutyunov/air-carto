import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { Statistic } from './statistic';

/**
 * Aggregated statistics item
 */
export class StatisticsItem {
	@ApiProperty({
		name: 'stationId',
		description: 'Station ID',
		type: 'string',
	})
	@AutoMap()
	public stationId: string;
	@ApiProperty({
		name: 'statistics',
		description: 'Statistics array',
		type: Statistic,
		isArray: true,
	})
	@AutoMap(() => [Statistic])
	@Type(() => Statistic)
	public statistics: Statistic[];
}
