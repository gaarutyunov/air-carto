import { Type } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { SqlResponse } from '../sql/sql-response';
import { SpatialDto } from './spatial-dto';

/**
 * Spatial SQL API response
 */
export class SpatialQueryResponse extends SqlResponse<SpatialDto> {
	@AutoMap(() => [SpatialDto])
	@Type(() => SpatialDto)
	public rows: SpatialDto[]; // generics are not supported by class-transformer
}
