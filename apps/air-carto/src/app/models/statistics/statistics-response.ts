import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { SearchResponse } from '../search/search-response';
import { StatisticsItem } from './statistics-item';

/**
 * Statistics API response
 */
export class StatisticsResponse extends SearchResponse<StatisticsItem> {
	@ApiProperty({
		name: 'hits',
		description: 'Statistics items',
		type: StatisticsItem,
		isArray: true,
	})
	@AutoMap(() => [StatisticsItem])
	public override hits: StatisticsItem[]; // this override is necessary since the generic type is not inferred by automapper
}
