import { useSettings } from "@backend/stores";
import { TrackInfo } from "@backend/types";

const getBaseUrl = () => useSettings.getState().system.server ?? "https://demo.laudiol.in";
const getGatewayUrl = () => useSettings.getState().system.gateway ?? "wss://demo.laudiol.in";

const getLoginUrl = () => `${getBaseUrl()}/login`;

/**
 * Fetches the track information from the server.
 *
 * @param id The track ID to fetch.
 */
async function fetchTrack(id: string): Promise<TrackInfo> {
    const response = await fetch(`${getBaseUrl()}/fetch/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch track: ${response.statusText}`);
    }

    return response.json();
}

export default {
    getBaseUrl,
    getGatewayUrl,
    getLoginUrl,
    fetchTrack
}
