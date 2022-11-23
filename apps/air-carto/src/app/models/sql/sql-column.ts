import { AutoMap } from '@automapper/classes';

/**
 * Schema column
 */
export class SqlColumn {
	@AutoMap()
	public name: string;
	@AutoMap()
	public type: string;
}
