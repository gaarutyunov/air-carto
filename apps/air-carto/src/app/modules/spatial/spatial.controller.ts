import { Body, Controller, HttpCode, Post, Scope } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { SpatialResponse } from '../../models/spatial/spatial-response';
import { StatisticsRequest } from '../../models/statistics/statistics-request';
import { SpatialService } from './spatial.service';

@Controller({
	scope: Scope.REQUEST,
	path: 'spatial',
})
export class SpatialController {
	constructor(private readonly _service: SpatialService) {}

	@Post()
	@HttpCode(200)
	@ApiOperation({
		summary: 'Spatial join',
		description: `It returns the requested statistical measurement for a given variable for each station including information about affected population.

Dataset used: [Population Mosaics - Spain (Grid 100m, 2010)](https://clausa.app.carto.com/catalog/dataset/wp_population_8d42d536)

Parameters:

-   Time range to filter by.
-   Variable (so2, no2, co, ...).
-   Statistical measurement (avg, max, min, ...)`,
	})
	public getStatistics(
		@Body() request: StatisticsRequest
	): Promise<SpatialResponse> {
		return this._service.getStatistics(request);
	}
}
