import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { StatisticsItem } from '../statistics/statistics-item';

/**
 * Aggregated statistics item with affected population
 */
export class SpatialItem extends StatisticsItem {
	@ApiProperty({
		name: 'affectedPopulation',
		description: 'Affected population',
		type: 'number',
		format: 'double',
	})
	@AutoMap()
	public affectedPopulation: number;
}
