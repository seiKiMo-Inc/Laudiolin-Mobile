import type { SearchResult, SearchResults } from "@backend/types";
import { Gateway } from "@app/constants";

const blank: SearchResult = {
    title: "", artist: "", icon: "",
    url: "", id: "", duration: -1
}

/**
 * Performs a search for the given query.
 * @param query The search query.
 */
export async function doSearch(query: string): Promise<SearchResults> {
    const engine = "All"; // TODO: Add option to change engine.

    try {
        // Perform a request to the backend.
        console.log(`${Gateway.url}/search/${query}?query=${engine}`)
        const response = await fetch(`${Gateway.url}/search/${query}?query=${engine}`);
        // Return the response as a search results object.
        return await response.json() as SearchResults;
    } catch (error) {
        console.error(error);

        return {
            results: [],
            top: blank
        };
    }
}
