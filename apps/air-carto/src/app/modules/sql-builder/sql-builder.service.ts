import * as squel from 'squel';

import { Injectable, Scope } from '@nestjs/common';

/**
 * This service should export some universal API to build sql queries.
 * In addition, it could use cache to store sql queries.
 * Since we have a simple use case, we can use squel library directly to build queries.
 */
@Injectable({ scope: Scope.REQUEST })
export class SqlBuilderService {
	public build(
		projector: (builder: squel.PostgresSquel) => squel.BaseBuilder
	): Promise<string> {
		/**
		 * Build a new query.
		 */
		return new Promise((resolve, reject) => {
			try {
				// other flavours use quotation marks for aliases, but it's inconvenient inside query parameter
				const builder = squel.useFlavour('postgres');
				const query = projector(builder).toString().toLowerCase();
				resolve(query);
			} catch (error) {
				reject(error);
			}
		});
	}
}
