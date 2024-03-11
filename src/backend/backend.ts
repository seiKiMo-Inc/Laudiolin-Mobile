import { useSettings } from "@backend/stores";

const getBaseUrl = () => useSettings.getState().system.server ?? "https://demo.laudiol.in";
const getGatewayUrl = () => useSettings.getState().system.gateway ?? "wss://demo.laudiol.in";

const getLoginUrl = () => `${getBaseUrl()}/login`;

export default {
    getBaseUrl,
    getGatewayUrl,
    getLoginUrl
}
