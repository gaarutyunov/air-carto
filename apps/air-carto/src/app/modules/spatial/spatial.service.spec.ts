import { Test, TestingModule } from '@nestjs/testing';

import { COLLECTION, TABLES } from '../../constants/injection-tokens';
import { Aggregate } from '../../enums/aggregate';
import { Variable } from '../../enums/variable';
import { SpatialItem } from '../../models/spatial/spatial-item';
import { SpatialResponse } from '../../models/spatial/spatial-response';
import { Statistic } from '../../models/statistics/statistic';
import { StatisticsRequest } from '../../models/statistics/statistics-request';
import { TimeRange } from '../../models/statistics/time-range';
import { MapperModule } from '../mapper/mapper.module';
import { SqlApiService } from '../sql-api';
import { SqlBuilderModule } from '../sql-builder';
import { SpatialService } from './spatial.service';

describe('SpatialService', () => {
	let service: SpatialService;
	const executeQuery = jest.fn().mockResolvedValueOnce({
		rows: [
			{
				co: 1,
				station_id: 'test',
				affected_population: 100,
			},
		],
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpatialService,
				{
					provide: TABLES,
					useValue: {
						stations:
							'cartodb-gcp-backend-data-team.code_test.airquality_stations',
						statistics:
							'cartodb-gcp-backend-data-team.code_test.airquality_measurements',
						population_data:
							'carto-data.ac_svhknbdi.sub_worldpop_demographics_population_esp_grid100m_v1_yearly_2010',
						population_geo:
							'carto-data.ac_svhknbdi.sub_worldpop_geography_esp_grid100m_v1',
					},
				},
				{
					provide: SqlApiService,
					useValue: {
						executeQuery,
					},
				},
				{
					provide: COLLECTION,
					useValue: 'carto_dw',
				},
			],
			imports: [MapperModule, SqlBuilderModule],
		}).compile();

		service = await module.resolve<SpatialService>(SpatialService);
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
			`with grouped as (select a_1.station_id as station_id, avg(co) as co from cartodb-gcp-backend-data-team.code_test.airquality_measurements as a_1 where (cast(a_1.timeinstant as timestamp) between timestamp_millis(1420070400000) and timestamp_millis(1546214400000)) group by a_1.station_id) select a_1.co as co, a_1.station_id as station_id, a_4.population as affected_population from grouped as a_1 inner join cartodb-gcp-backend-data-team.code_test.airquality_stations as a_2 on (a_1.station_id = a_2.station_id) inner join carto-data.ac_svhknbdi.sub_worldpop_geography_esp_grid100m_v1 as a_3 on (st_contains(a_3.geom, a_2.geom)) inner join carto-data.ac_svhknbdi.sub_worldpop_demographics_population_esp_grid100m_v1_yearly_2010 as a_4 on (a_3.geoid = a_4.geoid)`
		);

		expect(response).toEqual(
			Object.assign(new SpatialResponse(), {
				hits: [
					Object.assign(new SpatialItem(), {
						stationId: 'test',
						affectedPopulation: 100,
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
