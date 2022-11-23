import { Injectable } from '@nestjs/common';

import type { Mapper } from '@automapper/core';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { TimeSeries } from '../models/time-series/time-series';
import { TimeSeriesDto } from '../models/time-series/time-series-dto';
import { TimeSeriesItem } from '../models/time-series/time-series-item';
import { TimeSeriesQueryResponse } from '../models/time-series/time-series-query-response';
import { TimeSeriesResponse } from '../models/time-series/time-series-response';

/**
 * Automapper profile for time-series statistics.
 * The mapping could also be done directly in SQL but this is a good example of how to use automapper.
 */
@Injectable()
export class TimeSeriesProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	override get profile() {
		return (mapper: Mapper) => {
			createMap(
				mapper,
				TimeSeriesDto,
				TimeSeriesItem,
				forMember(
					(dest) => dest.statistics,
					mapFrom(
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						({ stationId, period, ...rest }) =>
							Object.entries(rest).map(([name, value]) =>
								Object.assign(new TimeSeries(), {
									name,
									value,
									period,
									unit: 'μg/m3', // we should use some metadata layer for this, for now it is hardcoded
								})
							)
					)
				)
			);

			createMap(
				mapper,
				TimeSeriesQueryResponse,
				TimeSeriesResponse,
				forMember(
					(dest) => dest.hits,
					mapFrom((src) =>
						Object.values(
							mapper
								.mapArray(
									src.rows,
									TimeSeriesDto,
									TimeSeriesItem
								)
								.reduce((acc, item) => {
									const key = item.stationId;
									if (!acc[key]) {
										acc[key] = item;
									} else {
										acc[key].statistics.push(
											...item.statistics
										);
									}

									return acc;
								}, {})
						)
					)
				)
			);
		};
	}
}
