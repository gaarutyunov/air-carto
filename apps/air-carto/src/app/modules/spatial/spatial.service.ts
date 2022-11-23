import { plainToInstance } from 'class-transformer';

import { Inject, Injectable, Scope } from '@nestjs/common';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { COLLECTION, TABLES } from '../../constants/injection-tokens';
import { SpatialDto } from '../../models/spatial/spatial-dto';
import { SpatialQueryResponse } from '../../models/spatial/spatial-query-response';
import { SpatialResponse } from '../../models/spatial/spatial-response';
import { StatisticsRequest } from '../../models/statistics/statistics-request';
import { SqlApiService } from '../sql-api';
import { SqlBuilderService } from '../sql-builder';

@Injectable({ scope: Scope.REQUEST })
export class SpatialService {
	@Inject(TABLES)
	private readonly tables: Record<string, string>;
	@Inject(COLLECTION)
	private readonly collection: string;

	constructor(
		private readonly _sqlBuilder: SqlBuilderService,
		private readonly _sqlApi: SqlApiService,
		@InjectMapper() private readonly _mapper: Mapper
	) {}

	public async getStatistics(
		request: StatisticsRequest
	): Promise<SpatialResponse> {
		const query = await this._generateQuery(request);

		return await this._sqlApi
			.executeQuery<SpatialDto>(this.collection, query)
			.then((response) =>
				this._mapper.map(
					plainToInstance(SpatialQueryResponse, response),
					SpatialQueryResponse,
					SpatialResponse
				)
			);
	}

	private _generateQuery(request: StatisticsRequest): Promise<string> {
		return this._sqlBuilder.build((builder) =>
			builder
				.select()
				.with(
					'grouped',
					builder
						.select()
						.from(this.tables['statistics'], 'a_1')
						.field('a_1.station_id', 'station_id')
						.field(
							`${request.filter.aggregate}(${request.filter.variable})`,
							request.filter.variable
						)
						.where(
							'CAST(a_1.timeinstant as TIMESTAMP) BETWEEN TIMESTAMP_MILLIS(?) AND TIMESTAMP_MILLIS(?)',
							request.filter.timeRange.from.getTime(),
							request.filter.timeRange.to.getTime()
						)
						.group('a_1.station_id')
				)
				.field(
					`a_1.${request.filter.variable}`,
					request.filter.variable
				)
				.field('a_1.station_id', 'station_id')
				.field('a_4.population', 'affected_population')
				.from('grouped', 'a_1')
				.join(
					this.tables['stations'],
					'a_2',
					'a_1.station_id = a_2.station_id'
				)
				.join(
					this.tables['population_geo'],
					'a_3',
					'ST_CONTAINS(a_3.geom, a_2.geom)'
				)
				.join(
					this.tables['population_data'],
					'a_4',
					'a_3.geoid = a_4.geoid'
				)
		);
	}
}
