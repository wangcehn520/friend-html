import Cookies from 'js-cookie';
import {UserType} from "../models/user";


export function getCurrentUser() {
    return Cookies.get("CurrentUser")
}

export function setCurrentUser(code) {
    return Cookies.set("CurrentUser", code)
}

export function removeCurrentUser() {
    return Cookies.remove("CurrentUser")
}
