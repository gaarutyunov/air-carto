import { Type } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { SqlResponse } from '../sql/sql-response';
import { TimeSeriesDto } from './time-series-dto';

/**
 * SQL query result for time-series API
 */
export class TimeSeriesQueryResponse extends SqlResponse<TimeSeriesDto> {
	@AutoMap(() => [TimeSeriesDto])
	@Type(() => TimeSeriesDto)
	public override rows: TimeSeriesDto[]; // generics are not supported by class-transformer
}
