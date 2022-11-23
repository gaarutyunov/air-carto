import { Test, TestingModule } from '@nestjs/testing';

import { Aggregate } from '../../enums/aggregate';
import { Variable } from '../../enums/variable';
import { Statistic } from '../../models/statistics/statistic';
import { StatisticsItem } from '../../models/statistics/statistics-item';
import { StatisticsRequest } from '../../models/statistics/statistics-request';
import { StatisticsResponse } from '../../models/statistics/statistics-response';
import { TimeRange } from '../../models/statistics/time-range';
import { CoreModule } from '../core/core.module';
import { MapperModule } from '../mapper/mapper.module';
import { SqlApiService } from '../sql-api';
import { SqlBuilderModule } from '../sql-builder';
import { StatisticsService } from './statistics.service';

describe('StatisticsService', () => {
	let service: StatisticsService;
	const executeQuery = jest.fn().mockResolvedValueOnce({
		rows: [
			{
				co: 1,
				station_id: 'test',
			},
		],
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StatisticsService,
				{
					provide: SqlApiService,
					useValue: {
						executeQuery,
					},
				},
			],
			imports: [
				MapperModule,
				SqlBuilderModule,
				CoreModule.forRoot({
					tables: {
						statistics:
							'cartodb-gcp-backend-data-team.code_test.airquality_measurements',
					},
					collection: 'carto_dw',
				}),
			],
		}).compile();

		service = await module.resolve<StatisticsService>(StatisticsService);
	});

	it('should get specified statistic', async () => {
		const response = await service.getStatistics(
			Object.assign(new StatisticsRequest(), {
				filter: {
					aggregate: Aggregate.AVG,
					variable: Variable.CARBON_MONOXIDE,
					timeRange: Object.assign(new TimeRange(), {
						from: new Date('2015-01-01'),
						to: new Date('2018-12-31'),
					}),
				},
			})
		);

		expect(executeQuery).toHaveBeenCalledWith(
			'carto_dw',
			`select avg(co) as co, a_1.station_id as station_id from cartodb-gcp-backend-data-team.code_test.airquality_measurements as a_1 where (cast(a_1.timeinstant as timestamp) between timestamp_millis(1420070400000) and timestamp_millis(1546214400000)) group by a_1.station_id`
		);

		expect(response).toEqual(
			Object.assign(new StatisticsResponse(), {
				hits: [
					Object.assign(new StatisticsItem(), {
						stationId: 'test',
						statistics: [
							Object.assign(new Statistic(), {
								name: 'co',
								value: 1,
								unit: 'μg/m3',
							}),
						],
					}),
				],
			})
		);
	});
});
