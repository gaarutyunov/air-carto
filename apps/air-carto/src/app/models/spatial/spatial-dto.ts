import { Expose } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { StatisticsDto } from '../statistics/statistics-dto';

/**
 * SQL query result row for spatial API
 */
export class SpatialDto extends StatisticsDto {
	@AutoMap()
	@Expose({ name: 'affected_population' })
	public affectedPopulation: number;
}
