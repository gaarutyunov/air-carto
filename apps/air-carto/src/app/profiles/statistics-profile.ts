import { Injectable } from '@nestjs/common';

import type { Mapper } from '@automapper/core';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { Statistic } from '../models/statistics/statistic';
import { StatisticsDto } from '../models/statistics/statistics-dto';
import { StatisticsItem } from '../models/statistics/statistics-item';
import { StatisticsQueryResponse } from '../models/statistics/statistics-query-response';
import { StatisticsResponse } from '../models/statistics/statistics-response';

/**
 * Automapper profile for statistics.
 * The mapping could also be done directly in SQL but this is a good example of how to use automapper.
 */
@Injectable()
export class StatisticsProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	override get profile() {
		return (mapper: Mapper) => {
			createMap(
				mapper,
				StatisticsDto,
				StatisticsItem,
				forMember(
					(dest) => dest.statistics,
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					mapFrom(({ stationId, ...rest }) =>
						Object.entries(rest).map(([key, value]) =>
							Object.assign(new Statistic(), {
								name: key,
								value,
								unit: 'μg/m3', // we should use some metadata layer for this, for now it is hardcoded
							})
						)
					)
				)
			);

			createMap(
				mapper,
				StatisticsQueryResponse,
				StatisticsResponse,
				forMember(
					(dest) => dest.hits,
					mapFrom((src) =>
						mapper.mapArray(src.rows, StatisticsDto, StatisticsItem)
					)
				)
			);
		};
	}
}
