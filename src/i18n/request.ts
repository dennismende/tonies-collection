import { getRequestConfig } from "next-intl/server";

/**
 * next-intl request configuration.
 * Loads the English messages file. When adding new locales,
 * extend this function to resolve the locale dynamically.
 */
export default getRequestConfig(async () => {
    const locale = "en";

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
