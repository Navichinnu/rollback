import axios from "axios";
const genericUrl = process.env.CORE_SERVICE_URL;

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

export default async function get360MenuList(req, res) {
  const cookies = req.headers.cookie;
  const accessToken = parseCookie(cookies, 'accessToken');
  if (accessToken){
    try {
      const threeSixtyMenuList = await axios({
        method: "POST",
        url: genericUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.body.token}`,
        },
        data: {
          query: `query {
          getMenu(roleId: ${req.body.id !== null ? `"${req.body.id}"` : null})  
        }`,
        },
      });
      const menuList = JSON.parse(threeSixtyMenuList.data.data.getMenu);

      res.status(200).json(menuList);
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      res.status(500).json({ error: "Internal Server Error" });
    };
  }
};