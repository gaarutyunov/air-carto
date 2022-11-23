import { plainToInstance } from 'class-transformer';

import { Test, TestingModule } from '@nestjs/testing';

import { Aggregate } from '../../enums/aggregate';
import { Variable } from '../../enums/variable';
import { TimeSeries } from '../../models/time-series/time-series';
import { TimeSeriesItem } from '../../models/time-series/time-series-item';
import { TimeSeriesRequest } from '../../models/time-series/time-series-request';
import { TimeSeriesResponse } from '../../models/time-series/time-series-response';
import { CoreModule } from '../core/core.module';
import { MapperModule } from '../mapper/mapper.module';
import { SqlApiService } from '../sql-api';
import { SqlBuilderModule } from '../sql-builder';
import { TimeSeriesService } from './time-series.service';

describe('TimeSeriesService', () => {
	let service: TimeSeriesService;
	const executeQuery = jest.fn().mockResolvedValueOnce({
		rows: [
			{
				co: 1,
				station_id: 'test',
				period: new Date('2017-01-01'),
			},
			{
				co: 1,
				station_id: 'test1',
				period: new Date('2017-01-01'),
			},
			{
				co: 1,
				station_id: 'test',
				period: new Date('2017-01-02'),
			},
		],
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TimeSeriesService,
				{
					provide: SqlApiService,
					useValue: {
						executeQuery,
					},
				},
			],
			imports: [
				MapperModule,
				CoreModule.forRoot({
					tables: {
						statistics:
							'cartodb-gcp-backend-data-team.code_test.airquality_measurements',
					},
					collection: 'carto_dw',
				}),
				SqlBuilderModule,
			],
		}).compile();

		service = await module.resolve<TimeSeriesService>(TimeSeriesService);
	});

	it('should get specified statistic time-series', async () => {
		const response = await service.getStatistics(
			plainToInstance(TimeSeriesRequest, {
				filter: {
					aggregate: Aggregate.AVG,
					variable: Variable.CARBON_MONOXIDE,
					timeRange: {
						from: new Date('2015-01-01'),
						to: new Date('2018-12-31'),
					},
					step: '1 day',
				},
			})
		);

		expect(executeQuery).toHaveBeenCalledWith(
			'carto_dw',
			`select avg(co) as co, a_1.station_id as station_id, date_trunc(cast(a_1.timeinstant as timestamp), day) as period from cartodb-gcp-backend-data-team.code_test.airquality_measurements as a_1 where (cast(a_1.timeinstant as timestamp) between timestamp_millis(1420070400000) and timestamp_millis(1546214400000)) group by a_1.station_id, period order by period desc`
		);

		expect(response).toEqual(
			Object.assign(new TimeSeriesResponse(), {
				hits: [
					Object.assign(new TimeSeriesItem(), {
						stationId: 'test',
						statistics: [
							Object.assign(new TimeSeries(), {
								name: 'co',
								value: 1,
								unit: 'μg/m3',
								period: new Date('2017-01-01'),
							}),
							Object.assign(new TimeSeries(), {
								name: 'co',
								value: 1,
								unit: 'μg/m3',
								period: new Date('2017-01-02'),
							}),
						],
					}),
					Object.assign(new TimeSeriesItem(), {
						stationId: 'test1',
						statistics: [
							Object.assign(new TimeSeries(), {
								name: 'co',
								value: 1,
								unit: 'μg/m3',
								period: new Date('2017-01-01'),
							}),
						],
					}),
				],
			})
		);
	});
});
