import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { Variable } from '../../enums/variable';

/**
 * Aggregated statistic
 */
export class Statistic {
	@ApiProperty({
		name: 'name',
		description: 'Name of statistic',
		type: 'string',
		enum: Variable,
	})
	@AutoMap()
	public name: string;
	@ApiProperty({
		name: 'value',
		description: 'Value of statistic',
		type: 'number',
		format: 'double',
	})
	@AutoMap()
	public value: number;
	@ApiProperty({
		name: 'unit',
		description: 'Unit of statistic',
		type: 'string',
	})
	@AutoMap()
	public unit: string;
}
