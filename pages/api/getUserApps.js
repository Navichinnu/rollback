import axios from "axios";
// import { tamURL } from "../../serverConfig";
const tamURL = process.env.NEXT_PUBLIC_tamURL

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

export default async function UserApps(req, res) {
    const cookies = req.headers.cookie;
    const accessToken = parseCookie(cookies, 'accessToken');
    if (accessToken) {
        if (req.method !== 'POST') return res.status(405).send()
        const response = await axios({
            url: `${tamURL}tenant/getUserApps`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: req.body
        });
        response.status = 200 ? res.status(200).json(response.data) : res.status(500)
    };
};