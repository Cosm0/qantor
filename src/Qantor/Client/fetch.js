export const fetchJson = async function (url, method, obj = null, headers = null) {
    const fullHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    Object.assign(fullHeaders, headers);

    return (await fetch(url, {
        method,
        headers: fullHeaders,
        body: obj !== null ? JSON.stringify(obj) : null
    })).json();
};
