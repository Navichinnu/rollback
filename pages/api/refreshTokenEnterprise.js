import axios from "axios";
const enterprise = process.env.ENTERPRISE_REFRESHTOKEN_URL;

export default async function enterpriseSignIn(req, res) {
    // try {
      const response = await axios({
        method: "POST",
        url: enterprise,
        headers: {
          "Content-Type": "application/json",
        },
        data:{
            "refreshToken": `${ req.body.refreshToken}`
        }
      });
      const menuList = response.data;
      res.status(200).json(menuList);
    // } catch (error) {
    //   console.error(JSON.stringify(error, null, 2));
    //   res.status(500).json(error);
    // };
};