/**
 * Base search response with paginated results and total values
 */
export class SearchResponse<THit> {
	public hits: THit[];
}
