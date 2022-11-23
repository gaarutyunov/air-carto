import { Injectable, Scope } from '@nestjs/common';

import { SqlResponse } from '../../models/sql/sql-response';
import { CartoService } from '../carto/carto.service';

/**
 * This service makes requests to CARTO SQL API.
 */
@Injectable({ scope: Scope.REQUEST })
export class SqlApiService {
	constructor(private readonly _http: CartoService) {}

	public async executeQuery<T>(
		collection: string,
		query: string
	): Promise<SqlResponse<T>> {
		/**
		 * Execute SQL query.
		 * @param collection - Collection name.
		 * @param query - SQL query.
		 */
		return this._http.get(`/v3/sql/${collection}/query`, { q: query });
	}
}
