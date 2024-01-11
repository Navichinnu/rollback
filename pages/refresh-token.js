import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import Router from 'next/router';
import axios from 'axios';
import Loader from "../common/Loader";
import { message } from "antd";
import { useRouter } from "next/router";

export default function Refresh() {
    const router = useRouter();
    const { redirect_uri } = router.query;
    const Instance = process.env.NEXT_PUBLIC_INSTANCE_TYPE;
    const domainURL = process.env.NEXT_PUBLIC_domain;
    let paramsUri;
    if (redirect_uri !== undefined) {
        paramsUri = redirect_uri;
    };
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        if(Instance === "Enterprise"){
            try {
                let refresh = localStorage.getItem("refreshToken")
                let body = { refreshToken: refresh };
                await axios.post(`/api/refreshTokenEnterprise`, body, {}).then(async (res) => {
                    if (res.status === 200) {
                        console.log(res)
                        let d = new Date();
                        d.setTime(d.getTime() + 60 * 60 * 1000); 
                        // d.setTime(d.getTime() + 60 * 1000); 
                        let expires = "expires=" + d.toUTCString();
                         let domain = "domain=" + domainURL;
                         document.cookie = "Enterprise.accessToken" + "=" + res.data.accessToken + ";" + "expires=0" + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
                         document.cookie = "Enterprise.refreshToken" + "=" + res.data.refreshToken + ";" + "expires=0" + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
                         setLoading(false);
                         Router.push(`${paramsUri}`);
                        
                    } else {
                        console.log(res)
                        setLoading(false);
                        message.error("Something is wrong in UserTenants");
                    };
                });
            }catch (error) {
                console.log(error)
                setLoading(false);
                message.error(error.message);
                Router.push("/sign-in");
            }
        }else{
        try {
            setLoading(true);
            await Auth.currentSession();
            setLoading(false);
            Router.push(`${paramsUri}`);
        } catch (error) {
            setLoading(false);
            message.error(error.message);
            Router.push("/sign-in");
        };
    }
    };

    useEffect(() => {
        if (paramsUri) {
            refresh();
        };
    }, [paramsUri]);

    return (
        <>
            {loading === true ?
                <div className="absolute left-0 top-0 flex flex-col justify-center items-center  w-full h-full bg-white-o-87 rounded-[12px]">
                    <Loader />
                </div> :
                ""
            }
        </>
    );
};
