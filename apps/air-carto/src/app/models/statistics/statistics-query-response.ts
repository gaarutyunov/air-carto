import { Type } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { SqlResponse } from '../sql/sql-response';
import { StatisticsDto } from './statistics-dto';

/**
 * Statistics SQL API response
 */
export class StatisticsQueryResponse extends SqlResponse<StatisticsDto> {
	@AutoMap(() => [StatisticsDto])
	@Type(() => StatisticsDto)
	public rows: StatisticsDto[]; // generics are not supported by class-transformer
}
