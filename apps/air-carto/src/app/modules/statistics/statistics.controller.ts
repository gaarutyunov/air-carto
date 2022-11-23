import { Body, Controller, HttpCode, Post, Scope } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { StatisticsRequest } from '../../models/statistics/statistics-request';
import { StatisticsResponse } from '../../models/statistics/statistics-response';
import { StatisticsService } from './statistics.service';

/**
 * Controller that exposes statistics endpoints
 */
@Controller({
	scope: Scope.REQUEST,
	path: 'statistics',
})
export class StatisticsController {
	constructor(private readonly _service: StatisticsService) {}

	@Post()
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		type: StatisticsResponse,
		description: 'Success',
	})
	@ApiOperation({
		summary: 'Statistical measurement for stations',
		description: `It returns the requested statistical measurement for a given variable for each station.

Parameters:

-   Time range to filter by.
-   Variable (so2, no2, co, ...).
-   Statistical measurement (avg, max, min, ...)`,
	})
	public async getStatistics(
		@Body() request: StatisticsRequest
	): Promise<StatisticsResponse> {
		/**
		 * Get aggregated statistics (over stations) for a given variable and time range
		 * @param request - request body
		 */
		return await this._service.getStatistics(request);
	}
}
