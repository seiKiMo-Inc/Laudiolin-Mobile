/**
 * Determines which welcoming text to show the user.
 */
export function welcomeText(): string {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning!";
    if (hours < 18) return "Good afternoon!";
    return "Good evening!";
}

/**
 * Validates a server address.
 *
 * @param address The address to validate.
 */
export function validateAddress(address: string): string | null {
    if (!__DEV__ && !address.startsWith("https"))
        return "Address must be secure.";
    else if (!address.startsWith("http"))
        return "Invalid address.";

    if (!address.includes("://")) return "Invalid address.";
    if (!address.includes(".")) return "Invalid address.";

    return null; // All checks passed!
}

/**
 * Validates a socket server address.
 *
 * @param address The address to validate.
 */
export function validateSocket(address: string): string | null {
    if (!__DEV__ && !address.startsWith("wss"))
        return "Address must be secure.";
    else if (!address.startsWith("ws"))
        return "Invalid address.";

    if (!address.includes("://")) return "Invalid address.";
    if (!address.includes(".")) return "Invalid address.";

    return null; // All checks passed!
}
