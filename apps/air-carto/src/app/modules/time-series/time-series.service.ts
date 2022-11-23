import { plainToInstance } from 'class-transformer';

import { Inject, Injectable } from '@nestjs/common';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { COLLECTION, TABLES } from '../../constants/injection-tokens';
import { getEnumKeyByValue } from '../../enums/helpers';
import { Step } from '../../enums/step';
import { TimeSeriesDto } from '../../models/time-series/time-series-dto';
import { TimeSeriesQueryResponse } from '../../models/time-series/time-series-query-response';
import { TimeSeriesRequest } from '../../models/time-series/time-series-request';
import { TimeSeriesResponse } from '../../models/time-series/time-series-response';
import { SqlApiService } from '../sql-api';
import { SqlBuilderService } from '../sql-builder';

/**
 * Service for time-series queries
 */
@Injectable()
export class TimeSeriesService {
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
		request: TimeSeriesRequest
	): Promise<TimeSeriesResponse> {
		/**
		 * Get time-series of aggregated statistics (over stations) for a given variable and time range
		 */
		const query = await this._generateQuery(request);

		return await this._sqlApi
			.executeQuery<TimeSeriesDto>(this.collection, query)
			.then((response) =>
				this._mapper.map(
					plainToInstance(TimeSeriesQueryResponse, response),
					TimeSeriesQueryResponse,
					TimeSeriesResponse
				)
			);
	}

	private _generateQuery(request: TimeSeriesRequest): Promise<string> {
		return this._sqlBuilder.build((builder) =>
			builder
				.select()
				.field(
					`${request.filter.aggregate}(${request.filter.variable})`,
					request.filter.variable
				)
				.field('a_1.station_id', 'station_id')
				.field(
					`DATE_TRUNC(CAST(a_1.timeinstant as TIMESTAMP), ${getEnumKeyByValue(
						Step,
						request.filter.step
					)})`,
					'period'
				)
				.from(this.tables['statistics'], 'a_1')
				.group('a_1.station_id')
				.group('period')
				.order('period', false)
				.where(
					'CAST(a_1.timeinstant as TIMESTAMP) BETWEEN TIMESTAMP_MILLIS(?) AND TIMESTAMP_MILLIS(?)',
					request.filter.timeRange.from.getTime(),
					request.filter.timeRange.to.getTime()
				)
		);
	}
}
