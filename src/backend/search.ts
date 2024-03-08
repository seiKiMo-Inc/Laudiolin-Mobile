import { SearchResult, SearchEngine } from "@backend/types";

/**
 * Performs a track search on the backend.
 *
 * @param query The song to search for.
 * @param engine The engine to use for the search.
 */
export async function search(
    query: string, engine: SearchEngine = "youtube"
): Promise<SearchResult> {
    const response = await fetch(
        `https://app.seikimo.moe/search/${query}?engine=${engine}`,
        { cache: "default" }
    );
    return (await response.json()) as SearchResult;
}
