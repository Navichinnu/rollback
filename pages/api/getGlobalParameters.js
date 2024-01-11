import axios from "axios";
// import { genericUrl } from "../../serverConfig";
const genericUrl = process.env.CORE_SERVICE_URL ;

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

export default async function getGlobalParameters(req, res) {
  const cookies = req.headers.cookie;
  const accessToken = parseCookie(cookies, 'accessToken');
  if (accessToken) {
    try {
      const globalParametrsData = await axios({
        method: "POST",
        url: genericUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.body.token}`,
        },
        data: {
          query: `query { getGlobalParameters }`,
        },
      });

      const globalParameters = JSON.parse(globalParametrsData.data.data.getGlobalParameters);

      res.status(200).json(globalParameters);
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      res.status(500).json({ error: "Internal Server Error" });
    };
  };
};
