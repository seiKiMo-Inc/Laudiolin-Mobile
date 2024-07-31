import { useDownloads } from "@backend/stores";
import { TrackInfo } from "@backend/types";

function useLocal(track?: TrackInfo): boolean {
    const { downloaded: locals } = useDownloads();
    return locals.find(t => t.id === track?.id) != undefined;
}

export default useLocal;
