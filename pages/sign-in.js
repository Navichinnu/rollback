import Image from "next/image";
import React, { useEffect, useState } from "react";
import Router from 'next/router';
import { Auth } from 'aws-amplify';
import Loader from "../common/Loader";
////////////////// import { redirectURL } from "../serverConfig";
import { message } from "antd";
import axios from "axios";
import ThemeJson from "../common/UIServer.json";
import { useRouter } from "next/router";
import { getOAuthHeaders } from "../oAuthValidation";

const SignIn = () => {
  const redirectURL = process.env.NEXT_PUBLIC_redirectURL;
  const Instance = process.env.NEXT_PUBLIC_INSTANCE_TYPE;
  const plgURL = process.env.NEXT_PUBLIC_COREURL;
  const posURL =  process.env.NEXT_PUBLIC_posURL;
  const domainURL = process.env.NEXT_PUBLIC_domain;
  const router = useRouter();
  const { planId, freeTrial, country, redirect_uri } = router.query;
  let paramsPlanId, paramsFreeTrial, paramsCountry, paramsUri;
  if (planId !== undefined) {
    paramsPlanId = planId;
  };
  if (freeTrial !== undefined) {
    paramsFreeTrial = freeTrial;
  };
  if (country !== undefined) {
    paramsCountry = country;
  };
  if (redirect_uri !== undefined) {
    paramsUri = redirect_uri;
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let posRedirect;
  useEffect(() => {
    setLoading(true);
    check();
    posRedirect = localStorage.getItem("paramsUri")
    console.log(posRedirect)
  }, []);
  useEffect(() => {
    setLoading(true);
    check();
  }, []);

  const check = async () => {
    if(Instance === "Enterprise"){
      const authHeaders = await getOAuthHeaders();
      if(authHeaders?.token){
        setLoading(false);
        Router.push(`${redirectURL}`);
      }else{
        setLoading(false);
        if(posRedirect){
          Router.push(`${window.location.href}/?redirect_uri=${posRedirect}`);
        }else{
          Router.push(`${window.location.href}`);
        }
      }
    }else{
      try {
        await Auth.currentSession();
        setLoading(false);
        Router.push(`${redirectURL}`);
      } catch (error) {
        setLoading(false);
        if(posRedirect){
          Router.push(`${window.location.href}/?redirect_uri=${posRedirect}`);
        }else{
          Router.push(`${window.location.href}`);
        }
      };
    }
  };

  const getDataforEnterprise = async (data) => {
    //  console.log(data)
     let d = new Date();
     d.setTime(d.getTime() + 60 * 60 * 1000); 
     let expires = "expires=" + d.toUTCString();
      let domain = "domain=" + domainURL;
      document.cookie = "userId" + "=" + data.userId + ";" + "expires=0" + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
      document.cookie = "Enterprise.accessToken" + "=" + data.accessToken + ";" + "expires=0" + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
      document.cookie = "Enterprise.refreshToken" + "=" + data.refreshToken + ";" + "expires=0" + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
      document.cookie = "Enterprise" + "=" + true + ";" + "expires=0" + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
      document.cookie = "username" + "=" + data.username + ";" + "expires=0" + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
      localStorage.setItem("refreshToken",data.refreshToken)
      // document.cookie = "firstname" + "=" + sendName + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
      // document.cookie = "cart" + "=" + JSON.stringify(sendcart) + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
      // document.cookie = "tenantName" + "=" + sendtenantname + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
      // let body1 = {
      //     username: email,
      //     tenantId: tenantId
      // };
      let body2 = {
          token:  data.accessToken,
      };
      let body3 = {
          token: data.accessToken,
          id: null
      };
      try {
          // var win1 = document.getElementById('myIframe1').contentWindow;
          var win2 = document.getElementById('myIframe2').contentWindow;
          var win3 = document.getElementById('myIframe3').contentWindow;
          const [ globalParametersResponse, menuResponse] = await Promise.all([
              axios.post(`/api/getGlobalParameters`, body2, {}),
              axios.post(`/api/getMenuForEnterprise`, body3, {})
          ]);
          if (globalParametersResponse.status === 200) {
              /// let tweet =  JSON.parse(globalParametersResponse.data.User.CW360_V2_UI) 
              // localStorage.setItem("hideKey",tweet.appTheme.showNavBar)
              // localStorage.setItem("primeColor",tweet.appTheme.primaryColor)
              let data1 = { "globalParameters": globalParametersResponse.data }
              let data2 = { "userPreferences": globalParametersResponse.data.UserPreferences }
              // let data4 = { "hideKey":tweet.appTheme.showNavBar}
              // let data5 = { "primeColor":tweet.appTheme.primaryColor}
              globalParametersResponse.data.User.CW360_V2_UI = ThemeJson;
              // let data6 = { "logoUrl":tweet.appTheme.clientLogo}
              // if (globalParametersResponse.data.User.CW360_V2_UI === null || globalParametersResponse.data.User.CW360_V2_UI === undefined) {
              //     globalParametersResponse.data.User.CW360_V2_UI = ThemeJson;
              // } else {
              //     globalParametersResponse.data.User.CW360_V2_UI = JSON.parse(globalParametersResponse.data.User.CW360_V2_UI);
              // };
              // if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
              //     globalParametersResponse.data.User.CW360_V2_UI = ThemeJson;
              // };
              let data3 = { "userData": globalParametersResponse.data.User }
              win2.postMessage(data1, `${plgURL}`);
              win2.postMessage(data2, `${plgURL}`);
              // win2.postMessage(data5, `${plgURL}`);
              win2.postMessage(data3, `${plgURL}`);
              win3.postMessage(data3, `${posURL}`);
          };
          
          if (menuResponse.status === 200) {
            var win = document.getElementById('myIframe2').contentWindow;
            let data = {userApps:menuResponse.data[0]}
            win.postMessage(data, `${plgURL}`);
              if (paramsUri) {
                  Router.push(`${paramsUri}`);
              } else {
                  Router.push(`${redirectURL}`);
              };
          } else {
              setLoading(false);
              message.error("Something is wrong in getMenu");
          };
      } catch (error) {
          if (error.message === "Request failed with status code 500") {
            console.log(error)
              if (paramsUri) {
                  Router.push(`${paramsUri}`);
              } else {
                  Router.push(`${redirectURL}`);
              };
          };
      };
    };
    
      const handleLoginForEnterprise = async (event) => {
        event.preventDefault();
        setLoading(true);
        const payload = {
            "username": email,
            "password": password,
          };
          await axios.post(`/api/enterpriseSignIn`, payload, {}).then(res => {
            if (res.status === 200) {
                console.log(res.data)
                getDataforEnterprise(res.data);
                // getUserApps(authHeaders.email, tenant?.tenantId, authHeaders.token, tenant?.name);
            } else {
                setLoading(false);
                message.error("Something is wrong in upsertUserSession");
            };
        });
        
      };

  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    setLoading(true);
    Router.push(`/sign-up`);
  };

  const handleForgotPassword = () => {
    setLoading(true);
    Router.push(`/forgot-password`);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (paramsPlanId) {
      let tempBody = {
        username: email,
        processed: "N",
        cancelled: "N",
        planDetails: JSON.stringify({
          planId: paramsPlanId,
          trial: paramsFreeTrial,
          country: paramsCountry,
        }),
      };
      await axios
        .post(`/api/upsertSubscriptionCart`, tempBody, {})
        .then(async (res) => {
          if (res.status === 200) {
            try {
              const currentUser = await Auth.signIn(email, password);
              if (currentUser) {
                setLoading(false);
                Router.push("/choose-tenant");
              }
            } catch (error) {
              message.error(error.message);
              setLoading(false);
            }
          } else {
            setLoading(false);
            message.error("Something is wrong in upsertSubscriptionCart");
          }
        });
    } else {
      try {
        const currentUser = await Auth.signIn(email, password);
        if (currentUser) {
          setLoading(false);
          if (paramsUri) {
            Router.push({
              pathname: "/choose-tenant",
              query: { redirect_uri: paramsUri }, // Pass your prop as a query parameter
            });
          } else {
            Router.push("/choose-tenant");
          };
        }
      } catch (error) {
        message.error(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <section style={{ height: '100vh', width: '100%' }} className="bg-[#F3F4F9]  py-10 sm:py-14 h-screen">
        <div class="grid  mt-12 relative ">
          {/* <div className="grid col-span-1"></div> */}
          <div class="loginDiv max-w-[27rem] mx-auto bg-[#F3F4F9]  border-[#e2e2e2] border-solid border-[1px]" style={{}}>
            <div className="flex mt-10 justify-center items-center">
              <Image
                src="/images/cwsuite-logo.png"
                width={160}
                height={28}
                alt="LOGO"
              />
            </div>
            {/* <div className="bg-[#D9D9D9] ff-inter font-normal text-[16px] h-16 px-8 py-5 mx-6" style={{ textAlign: "center" }}> */}
            {/* <span className="flex justify-center items-center mt-5" style={{ fontWeight: 500, color: "#101828", fontSize: "1rem", lineHeight: "1.8rem", fontFamily: "Inter" }} >Log in to continue</span> */}
            {/* </div> */}
            <div className="mx-auto max-w-md">
              <form className="mx-10 mt-4" onSubmit={Instance === "Enterprise"?handleLoginForEnterprise:handleLogin}>
                <label className="ff-inter font-normal text-xs opacity-80 text-[#101828]">Username</label>
                <input
                  className="mb-4 w-full h-[40px] sm:h-[40px] rounded px-3 py-1 text-[#101828] placeholder:text-[#98A2B3] border-[0.5px] border-[#DaDaDa] text-xs ff-inter font-normal outline-none"
                  required
                  type="text"
                  placeholder="Enter Email"
                  value={email}
                  id="username"
                  name="username"
                  onChange={(ev) => { setEmail(ev.target.value) }}
                />
                <label className="ff-inter font-normal text-xs opacity-80 text-[#101828]">Password</label>
                <div className='flex items-center'>
                  <input
                    className=" w-full h-[40px] sm:h-[40px] px-3 py-1  border-[1px] border-[#dadada] text-[#101828] rounded placeholder:text-[#98A2B3] text-xs ff-inter font-normal outline-none"
                    required
                    type={showPassword ? 'text' : 'password'}
                    // placeholder="Enter your Password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(ev) => { setPassword(ev.target.value) }}
                  />
                  <img
                    onClick={togglePasswordVisibility}
                    className='-ml-9'
                    src='/images/eye.png'
                    alt="Toggle password visibility"
                    style={{ cursor: "pointer" }}
                    width={15}
                  />
                </div>
                <button id="login" name="login" onClick={Instance === "Enterprise"?handleLoginForEnterprise:handleLogin} className="flex items-center justify-center mb-2 xs:mt-[20px] sm:mt-[20px] w-full h-[50px] sm:h-[50px] px-4 py-2 text-white bg-[#91C507] text-[13px] ff-inter font-bold outline-none rounded">
                  Login
                </button>
              </form>
              <div className="mt-2 mb-7 mx-10 grid grid-cols-2" >
                <a onClick={handleSignUp} className="text-[#0500ED] font-normal ff-inter col-span-1" style={{ fontSize: "0.8rem", cursor: "pointer" }}>Sign Up</a>
                <p className="ff-inter ml-8 text-[#0500ED] col-span-1 font-normal text-center float-left" style={{ cursor: "pointer", fontSize: "0.8rem", marginRight: "-2.9em" }} onClick={handleForgotPassword} >Forgot Password?</p>
              </div>
            </div>
          </div>
          {/* <div className="grid col-span-1"></div> */}
          {loading && <div className="absolute left-0 top-0 flex flex-col justify-center items-center  w-full h-full bg-white-o-87 rounded-[12px]"><Loader /></div>}
        </div>
      </section>
    </>
  );
};

export default SignIn;
