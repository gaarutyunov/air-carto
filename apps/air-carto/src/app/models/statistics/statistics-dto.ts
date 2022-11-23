import { Expose } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

/**
 * SQL query result row for statistics API
 */
export class StatisticsDto {
	@AutoMap()
	public co?: number;
	@AutoMap()
	public no2?: number;
	@AutoMap()
	public o3?: number;
	@AutoMap()
	public pm10?: number;
	@AutoMap()
	public pm2_5?: number;
	@AutoMap()
	public so2?: number;
	@AutoMap()
	@Expose({ name: 'station_id' })
	public stationId: string;
}
