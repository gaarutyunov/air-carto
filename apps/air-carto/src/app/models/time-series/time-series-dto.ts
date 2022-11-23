import { Type } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { StatisticsDto } from '../statistics/statistics-dto';

/**
 * SQL query result row for time-series API
 */
export class TimeSeriesDto extends StatisticsDto {
	@AutoMap()
	@Type(() => Date)
	public period: Date;
}
