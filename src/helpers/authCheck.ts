export const getTokenCookie = () => {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
    
        if(key.trim() === "token") {
            return value;
        }
    }
}

export const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}