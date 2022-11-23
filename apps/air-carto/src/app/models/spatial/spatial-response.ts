import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { SearchResponse } from '../search/search-response';
import { SpatialItem } from './spatial-item';

/**
 * Spatial API response
 */
export class SpatialResponse extends SearchResponse<SpatialItem> {
	@ApiProperty({
		name: 'hits',
		description: 'Spatial items',
		type: SpatialItem,
		isArray: true,
	})
	@AutoMap(() => [SpatialItem])
	public override hits: SpatialItem[]; // this override is necessary since the generic type is not inferred by automapper
}
