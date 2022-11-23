import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

/**
 * Time range for filtering
 */
export class TimeRange {
	@ApiProperty({
		name: 'from',
		description: 'Start date of time range',
		type: 'string',
		format: 'date-time',
		required: true,
	})
	@AutoMap()
	@IsDate()
	@Type(() => Date)
	public from: Date;
	@ApiProperty({
		name: 'to',
		description: 'End date of time range',
		type: 'string',
		format: 'date-time',
		required: true,
	})
	@AutoMap()
	@IsDate()
	@Type(() => Date)
	public to: Date;
}
