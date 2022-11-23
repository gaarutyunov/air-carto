import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { SearchRequest } from '../search/search-request';
import { StatisticsFilter } from './statistics-filter';

/**
 * Statistics API request
 */
export class StatisticsRequest extends SearchRequest<StatisticsFilter> {
	@ApiProperty({
		name: 'filter',
		description: 'Filter for statistics',
		type: StatisticsFilter,
		required: true,
	})
	@AutoMap(() => StatisticsFilter)
	@ValidateNested()
	@IsDefined()
	@IsNotEmptyObject()
	@Type(() => StatisticsFilter)
	public override filter: StatisticsFilter; // this override is necessary since the generic type is not inferred by automapper
}
