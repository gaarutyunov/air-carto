import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TimeSeriesRequest } from '../../models/time-series/time-series-request';
import { TimeSeriesResponse } from '../../models/time-series/time-series-response';
import { TimeSeriesService } from './time-series.service';

/**
 * Controller that exposes time series endpoints
 */
@Controller('ts')
export class TimeSeriesController {
	constructor(private readonly _service: TimeSeriesService) {}

	@Post()
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		type: TimeSeriesResponse,
		description: 'Success',
	})
	@ApiOperation({
		summary: 'Timeseries for stations',
		description: `Timeseries time! Consider that somebody want to know how the air quality is evolving over the time. We need to create a new endpoint to return a timeserie per each station.

Parameters:

-   Time range to filter by.
-   Variable (so2, no2, co, ...).
-   Statistical measurement (avg, max, min, ...).
-   Step (1 week, 1 day, 1 hour).`,
	})
	public getStatistics(
		@Body() request: TimeSeriesRequest
	): Promise<TimeSeriesResponse> {
		/**
		 * Get time-series of aggregated statistics (over stations) for a given variable, time range and time step
		 */
		return this._service.getStatistics(request);
	}
}
