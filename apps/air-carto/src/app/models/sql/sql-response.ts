import { AutoMap } from '@automapper/classes';

import { SqlColumn } from './sql-column';

/**
 * Base SQL API response
 */
export class SqlResponse<TRow> {
	public rows: TRow[];
	@AutoMap(() => [SqlColumn])
	public schema: SqlColumn[];
}
