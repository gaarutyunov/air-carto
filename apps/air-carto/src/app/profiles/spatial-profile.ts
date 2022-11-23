import { Injectable } from '@nestjs/common';

import type { Mapper } from '@automapper/core';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { SpatialDto } from '../models/spatial/spatial-dto';
import { SpatialItem } from '../models/spatial/spatial-item';
import { SpatialQueryResponse } from '../models/spatial/spatial-query-response';
import { SpatialResponse } from '../models/spatial/spatial-response';
import { Statistic } from '../models/statistics/statistic';

/**
 * Automapper profile for statistics with affected population.
 * The mapping could also be done directly in SQL but this is a good example of how to use automapper.
 */
@Injectable()
export class SpatialProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	override get profile() {
		return (mapper: Mapper) => {
			createMap(
				mapper,
				SpatialDto,
				SpatialItem,
				forMember(
					(dest) => dest.statistics,
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					mapFrom(({ stationId, affectedPopulation, ...rest }) =>
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
				SpatialQueryResponse,
				SpatialResponse,
				forMember(
					(dest) => dest.hits,
					mapFrom((src) =>
						mapper.mapArray(src.rows, SpatialDto, SpatialItem)
					)
				)
			);
		};
	}
}
