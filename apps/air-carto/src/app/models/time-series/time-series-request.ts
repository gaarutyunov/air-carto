import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { SearchRequest } from '../search/search-request';
import { TimeSeriesFilter } from './time-series-filter';

/**
 * Request for time series API
 */
export class TimeSeriesRequest extends SearchRequest<TimeSeriesFilter> {
	@ApiProperty({
		name: 'filter',
		description: 'Filter for time series',
		type: TimeSeriesFilter,
		required: true,
	})
	@AutoMap(() => TimeSeriesFilter)
	@ValidateNested()
	@IsDefined()
	@IsNotEmptyObject()
	@Type(() => TimeSeriesFilter)
	public override filter: TimeSeriesFilter; // this override is necessary to redefine decorators and filter type
}
