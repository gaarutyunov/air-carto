import { Type } from 'class-transformer';
import {
	IsDefined,
	IsEnum,
	IsNotEmptyObject,
	ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { Aggregate } from '../../enums/aggregate';
import { Variable } from '../../enums/variable';
import { TimeRange } from './time-range';

/**
 * Filter for statistics API
 */
export class StatisticsFilter {
	@ApiProperty({
		name: 'timeRange',
		description: 'Time range for statistics',
		type: TimeRange,
		required: true,
	})
	@AutoMap(() => TimeRange)
	@ValidateNested()
	@IsDefined()
	@IsNotEmptyObject()
	@Type(() => TimeRange)
	public timeRange: TimeRange;
	@ApiProperty({
		name: 'aggregate',
		description: 'Aggregation method for statistics',
		type: 'string',
		enum: Aggregate,
		required: true,
	})
	@AutoMap()
	@IsEnum(Aggregate)
	public aggregate: Aggregate;
	@ApiProperty({
		name: 'variable',
		description: 'Variable for aggregation',
		type: 'string',
		enum: Variable,
		required: true,
	})
	@AutoMap()
	@IsEnum(Variable)
	public variable: Variable;
}
