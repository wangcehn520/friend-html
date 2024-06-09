import Cookies from 'js-cookie';


export function getMessageNumber() {
    return Cookies.get("MessageNumber")
}

export function setMessageNumber(number) {
    return Cookies.set("MessageNumber", number)
}

export function removeMessageNumber() {
    return Cookies.remove("MessageNumber")
}
