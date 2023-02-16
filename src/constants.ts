import { updateTargetRoute } from "@backend/user";
import { Platform } from "react-native";

type AppData = {
    dev: boolean;

    encrypted: boolean;
    address: string;
    port: number;

    localEncrypted: boolean;
    localAddress: string;
    localPort: number;

    adbEncrypted: boolean;
    adbAddress: string;
    adbPort: number;
}

let app: AppData = {
    dev: false,

    encrypted: true,
    address: "app.seikimo.moe",
    port: 443,

    localEncrypted: false,
    localAddress: "192.168.1.2",
    localPort: 3000,

    adbEncrypted: false,
    adbAddress: "10.0.2.2",
    adbPort: 3000,
};

/**
 * Sets the app data.
 * @param data The 'app.json' object data.
 */
export function setAppData(data: any): void {
    app = data;

    // Update the gateway.
    if (!app.dev) {
        Gateway.url = `${app.encrypted ? "https:" : "http:"}//${app.address}:${app.port}`;
        Gateway.socket = `${app.encrypted ? "wss:" : "ws:"}//${app.address}:${app.port}`;
    } else {
        let encrypted = Platform.OS == "ios" ? app.localEncrypted : app.adbEncrypted;
        let address = Platform.OS == "ios" ? app.localAddress : app.adbAddress;
        let port = Platform.OS == "ios" ? app.localPort : app.adbPort;

        Gateway.url = `${encrypted ? "https:" : "http:"}//${address}:${port}`;
        Gateway.socket = `${encrypted ? "wss:" : "ws:"}//${address}:${port}`;
    }

    // Update gateway dependencies.
    updateTargetRoute();
}

export let Gateway = {
    url: `${app.encrypted ? "https:" : "http:"}//${app.address}:${app.port}`,
    socket: `${app.encrypted ? "wss:" : "ws:"}//${app.address}:${app.port}`,

    getUrl: () => Gateway.url,
};
