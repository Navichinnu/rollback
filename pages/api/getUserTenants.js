// import { tamURL } from "../../serverConfig";
import axios from "axios";

const tamURL = process.env.NEXT_PUBLIC_tamURL;
function parseCookie(cookieString, key) {
    if (!cookieString) {
        return null;
    };
    const cookies = cookieString.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const [cookieKey, cookieValue] = cookie.split('=');
        if (cookieKey.search(key) > 0) {
            return decodeURIComponent(cookieValue);
        };
    };
    return null;
};

export default async function getUserTenants(req, res) {
    const cookies = req.headers.cookie;
    const accessToken = parseCookie(cookies, 'accessToken');
    if (accessToken) {
        if (req.method !== 'POST') return res.status(405).send()
        const body = { ...req.body };
        const response = await axios({
            url: `${tamURL}tenant/getUserTenants`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body)
        });
        response.status = 200 ? res.status(200).json(response.data) : res.status(500)
    };
};