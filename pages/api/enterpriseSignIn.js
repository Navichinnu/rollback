import axios from "axios";
const enterprise = process.env.ENTERPRISE_SIGNIN_URL;


export default async function enterpriseSignIn(req, res) {

    try {
      const response = await axios({
        method: "POST",
        url: enterprise,
        headers: {
          "Content-Type": "application/json",
        },
        data: req.body
      });
      const menuList = response.data;

      res.status(200).json(menuList);
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      res.status(500).json({ error: "Internal Server Error" });
    };
};