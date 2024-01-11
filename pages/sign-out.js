import React, { useEffect, useState } from "react";
import Router from 'next/router';
import { Auth } from 'aws-amplify';
import Loader from "../common/Loader";
import { useRouter } from "next/router";
// import { appsURL, plgURL } from "../serverConfig";

const SignOut = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    // console.log(paramsUri)
    const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
    console.log(searchParams)
  const uri = searchParams.get("redirect_uri"); 
    console.log(uri)
    const plgURL = process.env.NEXT_PUBLIC_COREURL;
    const authURL = process.env.NEXT_PUBLIC_authURL;
    const appsURL = process.env.NEXT_PUBLIC_appsURL;
    const posURL = process.env.NEXT_PUBLIC_posURL;
    const Instance = process.env.NEXT_PUBLIC_INSTANCE_TYPE;
    const domainURL= process.env.NEXT_PUBLIC_domain;
    // const {globalStore,setGlobalStore} = useGlobalContext();
    function deleteLocalStorageData() {
        var iframe1 = document.getElementById('myIframe1');
        var iframe2 = document.getElementById('myIframe2');
        var iframe3 = document.getElementById('myIframe3');
        iframe1.contentWindow.postMessage('clearLocalStorage', `${appsURL}`);
        iframe2.contentWindow.postMessage('clearLocalStorage', `${plgURL}`);
        // iframe3.contentWindow.postMessage('clearLocalStorage', `${posURL}`);
    };

    const logout = async () => {
        if (Instance === "Enterprise") {
          try {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i];
              const eqPos = cookie.indexOf('=');
              const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
              const domain = "domain=" + domainURL;
              document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure=true; SameSite=Strict;' + domain;
            }
            setLoading(false);
            deleteLocalStorageData();
            console.log(uri, "redire");
            if (uri) {
              window.location.assign(`${authURL}sign-in/?&redirect_uri=${uri}`);
              } else {
                Router.push(`/sign-in`);
              }
          } catch (error) {
            setLoading(false);
            Router.push("/sign-in");
          }
        } else {
          try {
            await Auth.currentSession();
            try {
              await Auth.signOut({ global: true });
              const cookies = document.cookie.split(';');
              for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                const domain = "domain=" + domainURL;
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure=true; SameSite=Strict;' + domain;
              }
              setLoading(false);
              deleteLocalStorageData();
              if (uri) {
                window.location.assign(`${authURL}sign-in/?&redirect_uri=${uri}`);
              } else {
                Router.push("/sign-in");
              }
            } catch (error) {
              logout();
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            Router.push("/sign-in");
          }
        }
      };
  console.log(router.asPath)

useEffect(()=>{
  logout();
},[])

  

    return (
        <>
            {loading && <div className="absolute left-0 top-0 flex flex-col justify-center items-center  w-full h-full bg-white-o-87 rounded-[12px]"><Loader /></div>}
        </>
    );
};

export default SignOut;