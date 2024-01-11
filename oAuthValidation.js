// import { Auth } from 'aws-amplify';

// const parseJwt = (token) => {
//     try {
//         return JSON.parse(atob(token.split(".")[1]));
//     } catch (e) {
//         return null;
//     };
// };
// const Instance = process.env.NEXT_PUBLIC_INSTANCE_TYPE 
// export const getOAuthHeaders = async () => {
//     const cookies = document.cookie.split('; ');
//     let access_token;
//     let email;
//     let tenantId;
//     for (let i = 0; i < cookies.length; i++) {
//         const cookie = cookies[i].split('=');
//         const name = cookie[0];
//         const value = cookie[1];
//         if (name.search('accessToken') > 0) {
//             access_token = value;
//         };
//         if (name.search('LastAuthUser') > 0) {
//             email = decodeURIComponent(value);
//         };
//         if (name === "tenantId") {
//             tenantId = value;
//         };
//         if (name === "Enterprise"){
//             Enterprise = value;
//         }
//     };

//     if (access_token === undefined) {

//     } else {
//         const decodedToken = parseJwt(access_token);
//         const expirationTime = decodedToken.exp * 1000;
//         const currentTime = Date.now();
//         if(Instance === "Enterprise"){
//               if(expirationTime<currentTime){
//                 window.location.assign(`${window.location.href}`);
//               } else{
//                 return {
//                     token: access_token,
//                 };
//               }  
//         }else{
//             if (expirationTime < currentTime) {
//                 await Auth.currentSession();
//                 window.location.assign(`${window.location.href}`);
//             } else {
//                 return {
//                     token: access_token,
//                     email: email,
//                     tenantId: tenantId
//                 };
//             };
//         }
//     };
// };

import { parseCookies } from 'nookies';
import { Auth } from 'aws-amplify';
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    };
};

const SSOURL = process.env.NEXT_PUBLIC_authURL;
const Instance =   process.env.NEXT_PUBLIC_INSTANCE_TYPE 
export const getOAuthHeaders = async (context) => {
    let cookies;
    if(Instance !== "Enterprsie"){
         cookies = document.cookie.split('; ');
    }else{
         cookies = parseCookies(context);
    }
  

  let access_token;
  let email;
  let Enterprise;
  let refresh_token;
  let tenantId;

  if (Instance === "Enterprsie") {
    access_token = cookies.accessToken;
    refresh_token = cookies.refreshToken;
    email = decodeURIComponent(cookies.LastAuthUser);
    tenantId = cookies.tenantId;
  }else{
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        const name = cookie[0];
        const value = cookie[1];
        if (name.search('accessToken') > 0) {
            access_token = value;
        };
        if (name.search('LastAuthUser') > 0) {
            email = decodeURIComponent(value);
        };
        if (name === "tenantId") {
            tenantId = value;
        };
        if (name === "Enterprise"){
            Enterprise = value;
        }
    };

  }

  if (!access_token) {
    // Handle the case where the access token is not available
    // You can redirect the user to log in or refresh the token
  } else {
    const decodedToken = parseJwt(access_token);
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    if (expirationTime < currentTime) {
      if(Enterprise){
        localStorage.clear();
        window.location.assign(`${SSOURL}sign-out`);
      }else{
        await Auth.currentSession();
         window.location.assign(`${window.location.href}`);
      }
      // Handle token refresh logic here
      // You can redirect the user to a refresh token endpoint
    } else {
      return {
        token: access_token,
        email: email,
        tenantId: tenantId,
        refreshToken: refresh_token,
      };
    }
  }
};