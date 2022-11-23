import { plainToInstance } from 'class-transformer';

import { Inject, Injectable, Scope } from '@nestjs/common';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { COLLECTION, TABLES } from '../../constants/injection-tokens';
import { StatisticsDto } from '../../models/statistics/statistics-dto';
import { StatisticsQueryResponse } from '../../models/statistics/statistics-query-response';
import { StatisticsRequest } from '../../models/statistics/statistics-request';
import { StatisticsResponse } from '../../models/statistics/statistics-response';
import { SqlApiService } from '../sql-api';
import { SqlBuilderService } from '../sql-builder';

/**
 * Service for statistics queries
 */
@Injectable({ scope: Scope.REQUEST })
export class StatisticsService {
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
	): Promise<StatisticsResponse> {
		/**
		 * Get aggregated statistics (over stations) for a given variable and time range
		 */
		const query = await this._generateQuery(request);

		return await this._sqlApi
			.executeQuery<StatisticsDto>(this.collection, query)
			.then((response) =>
				this._mapper.map(
					plainToInstance(StatisticsQueryResponse, response),
					StatisticsQueryResponse,
					StatisticsResponse
				)
			);
	}

	private _generateQuery(request: StatisticsRequest): Promise<string> {
		return this._sqlBuilder.build((builder) =>
			builder
				.select()
				.field(
					`${request.filter.aggregate}(${request.filter.variable})`,
					request.filter.variable
				)
				.field('a_1.station_id', 'station_id')
				.from(this.tables['statistics'], 'a_1')
				.where(
					'CAST(a_1.timeinstant as TIMESTAMP) BETWEEN TIMESTAMP_MILLIS(?) AND TIMESTAMP_MILLIS(?)',
					request.filter.timeRange.from.getTime(),
					request.filter.timeRange.to.getTime()
				)
				.group('a_1.station_id')
		);
	}
}
