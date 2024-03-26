import { useFavorites } from "@backend/stores";
import { TrackInfo } from "@backend/types";

function useFavorite(track?: TrackInfo): boolean {
    const favorites = Object.values(useFavorites());
    return favorites.find(t => t.id === track?.id) != undefined;
}

export default useFavorite;
