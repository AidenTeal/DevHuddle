import qs from "query-string"

type UrlQueryParams = {
    params: string,
    key: string,
    value: string
}

type KeyQueryParams = {
    params: string,
    keysToRemove: string[]
}

export const formUrlQuery = ({params, key, value}: UrlQueryParams) => {
    const currentUrl = qs.parse(params);

    currentUrl[key] = value;

    return qs.stringifyUrl({
        url: window.location.pathname,
        query: currentUrl
    })
}

export const removeKeysFromQuery = ({params, keysToRemove}: KeyQueryParams) => {
    const currentUrl = qs.parse(params);

    keysToRemove.forEach((key) => {
        delete currentUrl[key];
    });

    return qs.stringifyUrl(
        {
        url: window.location.pathname,
        query: currentUrl,
        },
        { skipNull: true }
    )
}