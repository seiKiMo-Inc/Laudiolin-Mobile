import { updateTargetRoute } from "@backend/user";
import { LinkingOptions } from "@react-navigation/native/lib/typescript/src/types";

let app: any = {
    encrypted: false,
    address: "10.0.2.2",
    port: 3000
};

/**
 * Sets the app data.
 * @param data The 'app.json' object data.
 */
export function setAppData(data: any): void {
    app = data;

    // Update the gateway.
    Gateway.url = `${app.encrypted ? "https:" : "http:"}//${app.address}:${app.port}`;
    Gateway.socket = `${app.encrypted ? "wss:" : "ws:"}//${app.address}:${app.port}`;

    // Update gateway dependencies.
    updateTargetRoute();
}

export let Gateway = {
    url: `${app.encrypted ? "https:" : "http:"}//${app.address}:${app.port}`,
    socket: `${app.encrypted ? "wss:" : "ws:"}//${app.address}:${app.port}`,

    getUrl: () => Gateway.url,
};

export let LinkingConfig: LinkingOptions<any> = {
    prefixes: [
        "laudiolin://", "https://laudiolin.seikimo.moe"
    ],
    config: {
        screens: {
            Listen: "listen?id=:id",
            PlayTrack: "track?id=:id",
            Home: "*"
        }
    }
};
