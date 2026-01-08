import { languages } from "./index";
export function getText() {
    const lang = localStorage.getItem("lang") || "en"
    return languages[lang]
}