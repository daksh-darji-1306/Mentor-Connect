import Cookies from 'js-cookie';

/**
 * Save a user preference to a cookie
 * @param {string} key - The name of the cookie
 * @param {string} value - The value to store
 * @param {number} expires - Days until expiration (default: 365)
 */
export const setPreference = (key, value, expires = 365) => {
    Cookies.set(key, value, { expires, SameSite: 'Strict', Secure: true });
};

/**
 * Get a user preference from cookies
 * @param {string} key - The name of the cookie
 * @returns {string|undefined}
 */
export const getPreference = (key) => {
    return Cookies.get(key);
};

/**
 * Remove a preference cookie
 * @param {string} key 
 */
export const removePreference = (key) => {
    Cookies.remove(key);
};
