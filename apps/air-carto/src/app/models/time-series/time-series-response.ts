import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { SearchResponse } from '../search/search-response';
import { TimeSeriesItem } from './time-series-item';

/**
 * Time series API response
 */
export class TimeSeriesResponse extends SearchResponse<TimeSeriesItem> {
	@ApiProperty({
		name: 'hits',
		description: 'Time series items',
		type: TimeSeriesItem,
		isArray: true,
	})
	@AutoMap(() => [TimeSeriesItem])
	public override hits: TimeSeriesItem[]; // this override is necessary since the generic type is not inferred by automapper
}
