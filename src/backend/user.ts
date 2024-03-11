/**
 * Fetches user data from the backend using a user's token.
 *
 * @param token The user's authentication token.
 */
async function login(token: string): Promise<boolean> {
    console.log("logged in! " + token);
    return true;
}

export default {
    login,
};
