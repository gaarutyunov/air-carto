import { Module } from '@nestjs/common';

import { SqlApiModule } from '../sql-api';
import { SqlBuilderModule } from '../sql-builder';
import { SpatialController } from './spatial.controller';
import { SpatialService } from './spatial.service';

@Module({
	imports: [SqlApiModule, SqlBuilderModule],
	controllers: [SpatialController],
	providers: [SpatialService],
})
export class SpatialModule {}
