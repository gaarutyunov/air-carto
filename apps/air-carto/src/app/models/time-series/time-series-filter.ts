import { IsEnum } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { Step } from '../../enums/step';
import { StatisticsFilter } from '../statistics/statistics-filter';

/**
 * Filter for time series API
 */
export class TimeSeriesFilter extends StatisticsFilter {
	@ApiProperty({
		name: 'step',
		description: 'Step for time series',
		type: 'string',
		enum: Step,
		required: true,
	})
	@AutoMap()
	@IsEnum(Step)
	public step: Step;
}
