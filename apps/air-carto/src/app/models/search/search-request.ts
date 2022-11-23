/**
 * Base search request with pagination and filtering
 */
export class SearchRequest<TFilter> {
	public filter: TFilter;
}
