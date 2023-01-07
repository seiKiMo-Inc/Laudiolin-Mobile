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
}

export const Gateway = {
    url: `${app.encrypted ? "https:" : "http:"}//${app.address}:${app.port}`,
    socket: `${app.encrypted ? "wss:" : "ws:"}//${app.address}:${app.port}`
};
