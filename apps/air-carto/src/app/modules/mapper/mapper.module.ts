import { Global, Module } from '@nestjs/common';

import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';
import { AutomapperModule } from '@automapper/nestjs';

import { SpatialProfile } from '../../profiles/spatial-profile';
import { StatisticsProfile } from '../../profiles/statistics-profile';
import { TimeSeriesProfile } from '../../profiles/time-series-profile';

@Global()
@Module({
	imports: [
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
			namingConventions: new CamelCaseNamingConvention(),
		}),
	],
	providers: [StatisticsProfile, TimeSeriesProfile, SpatialProfile],
	exports: [],
})
export class MapperModule {}
