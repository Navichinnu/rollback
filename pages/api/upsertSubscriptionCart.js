// import { tamURL } from "../../serverConfig";
import axios from "axios";

const tamURL = process.env.NEXT_PUBLIC_tamURL
export default async function upsertSubscriptionCart(req, res) {
    if (req.method !== 'POST') return res.status(405).send()
    const body = { ...req.body }
    const response = await axios({
        url: `${tamURL}subscription/upsertSubscriptionCart`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(body)
    });
    response.status = 200 ? res.status(200).json(response.data) : res.status(500)
};