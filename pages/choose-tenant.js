import { useState, useEffect } from "react";
// import Loader from "../common/Loader";
// import { redirectURL, plgURL, posURL, appsURL } from "../serverConfig";
import { message, Skeleton } from "antd";
import Image from "next/image";
import axios from "axios";
import Router from 'next/router';
import { getOAuthHeaders } from "../oAuthValidation";
import ThemeJson from "../common/UIServer.json";
import { useRouter } from "next/router";

export default function ChooseTenant() {
    const redirectURL = process.env.NEXT_PUBLIC_redirectURL;
    const plgURL = process.env.NEXT_PUBLIC_COREURL;
    const appsURL = process.env.NEXT_PUBLIC_appsURL;
    const posURL = process.env.NEXT_PUBLIC_posURL;
    const domainURL = process.env.NEXT_PUBLIC_domain;
    const daysbefore = process.env.NEXT_PUBLIC_daysbefore;
    const daysafter = process.env.NEXT_PUBLIC_daysafter;
    const router = useRouter();
    const { redirect_uri } = router.query;
    let paramsUri;
    if (redirect_uri !== undefined) {
        paramsUri = redirect_uri;
    };
    const [loading, setLoading] = useState(false);
    const [multiTenantData, setMultiTenantData] = useState([]);
    const [name, setName] = useState("");
    const [cart, setCart] = useState("");

    const getUserApps = async (email, tenantId, token, tenantname, firstname, order) => {
        let d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        let sendName = name === "" ? firstname : name;
        let sendcart = cart === "" ? order : cart;
        let sendtenantname = tenantname;
        let domain = "domain=" + domainURL;
        document.cookie = "tenantId" + "=" + tenantId + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
        document.cookie = "firstname" + "=" + sendName + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
        document.cookie = "cart" + "=" + JSON.stringify(sendcart) + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
        document.cookie = "tenantName" + "=" + sendtenantname + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
        let body1 = {
            username: email,
            tenantId: tenantId
        };
        let body2 = {
            token: token
        };
        let body3 = {
            token: token,
            id: null
        };

        try {
            var win1 = document.getElementById('myIframe1').contentWindow;
            var win2 = document.getElementById('myIframe2').contentWindow;
            var win3 = document.getElementById('myIframe3').contentWindow;
            const [userAppsResponse, globalParametersResponse, menuResponse] = await Promise.all([
                axios.post(`/api/getUserApps`, body1, {}),
                axios.post(`/api/getGlobalParameters`, body2, {}),
                axios.post(`/api/getMenu`, body3, {})
            ]);
            if (userAppsResponse.status === 200) {
                // document.cookie = "userApps" + "=" + JSON.stringify(userAppsResponse?.data) + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
                let flag = "Y";
                let days = 0, index = -1;
                userAppsResponse?.data.map((item, ind) => {
                    if (item.freeTrial === "N") {
                        flag = "N";
                    };
                    if (ind === 0) {
                        index = ind
                        days = Math.ceil(Math.abs(new Date(item.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    } else {
                        if ((Math.ceil(Math.abs(new Date(item.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < days) && (Math.ceil(Math.abs(new Date(item.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) >= 0)) {
                            days = Math.ceil(Math.abs(new Date(item.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                            index = ind
                        };
                    };
                });
                let modifiedArray = userAppsResponse?.data.map((item, ind) => {
                    item.active = ((new Date() > new Date(item.subscriptionEndDate)) && !(new Date().getDate() === new Date(item.subscriptionEndDate).getDate())) ? "N" : "Y"
                    item.remainingDays = Math.ceil(Math.abs(new Date(item.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    item.daysbefore = daysbefore
                    item.daysafter = daysafter
                    if (flag === "Y") {
                        if (ind === index && index >= 0) {
                            item.navbar = "Y"
                        } else if (index >= 0) {
                            item.navbar = "N"
                        };
                    } else {
                        item.navbar = "N"
                    }
                    return item;
                });
                let userAppsResponseData = { userApps: modifiedArray };
                win1.postMessage(userAppsResponseData, `${appsURL}`);
                win2.postMessage(userAppsResponseData, `${plgURL}`);
            } else {
                setLoading(false);
                message.error("Something is wrong in user apps");
            };
            if (globalParametersResponse.status === 200) {
                // let tweet = ( JSON.parse(globalParametersResponse.data.User.CW360_V2_UI) )
                // localStorage.setItem("hideKey",tweet.appTheme.showNavBar)
                // localStorage.setItem("primeColor",tweet.appTheme.primaryColor)
                let data1 = { "globalParameters": globalParametersResponse.data }
                let data2 = { "userPreferences": globalParametersResponse.data.UserPreferences }
                // let data4 = { "hideKey":tweet.appTheme.showNavBar}
                // let data5 = { "primeColor":tweet.appTheme.primaryColor}
                // let data6 = { "logoUrl":tweet.appTheme.clientLogo}
                if (globalParametersResponse.data.User.CW360_V2_UI === null || globalParametersResponse.data.User.CW360_V2_UI === undefined) {
                    globalParametersResponse.data.User.CW360_V2_UI = ThemeJson;
                } else {
                    globalParametersResponse.data.User.CW360_V2_UI = globalParametersResponse.data.User.CW360_V2_UI;
                };

                if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
                    globalParametersResponse.data.User.CW360_V2_UI = ThemeJson;
                };
                let data3 = { "userData": globalParametersResponse.data.User }
                win2.postMessage(data1, `${plgURL}`);
                win2.postMessage(data2, `${plgURL}`);
                // win2.postMessage(data4, `${plgURL}`);
                // win2.postMessage(data5, `${plgURL}`);
                // win2.postMessage(data6, `${plgURL}`);
                win1.postMessage(data3, `${appsURL}`);
                // win1.postMessage(data4, `${appsURL}`);
                // win1.postMessage(data5, `${appsURL}`);
                // win1.postMessage(data6, `${appsURL}`);
                win2.postMessage(data3, `${plgURL}`);
                win3.postMessage(data3, `${posURL}`);
            };
            if (menuResponse.status === 200) {
                Object.entries(menuResponse.data).forEach(([key, value]) => {
                    const win = document.getElementById('myIframe2').contentWindow;
                    const data = { [key]: value };
                    win.postMessage(data, `${plgURL}`);
                  });
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
                if (paramsUri) {
                    Router.push(`${paramsUri}`);
                } else {
                    Router.push(`${redirectURL}`);
                };
            };
        };
    };

    const getUserTenants = async () => {
        const authHeaders = await getOAuthHeaders();
        if (authHeaders.token && authHeaders.email) {
            let body = { username: authHeaders.email };
            await axios.post(`/api/getUserTenants`, body, {}).then(async (res) => {
                if (res.status === 200) {
                    if (res?.data?.tenants?.length > 1) {
                        setMultiTenantData(res?.data?.tenants);
                        setName(res?.data?.firstname);
                        setCart(res?.data?.cart);
                        setLoading(false);
                    } else if (res?.data?.tenants?.length === 1) {
                        getUserApps(authHeaders.email, res?.data?.tenants[0]?.tenantId, authHeaders.token, res?.data?.tenants[0]?.name, res?.data?.firstname, res?.data?.cart);
                    };
                } else {
                    setLoading(false);
                    message.error("Something is wrong in UserTenants");
                };
            });
        };
    };

    useEffect(() => {
        setLoading(true);
        getUserTenants();
    }, []);

    const handleTenant = (tenant) => async () => {
        setLoading(true);
        const authHeaders = await getOAuthHeaders();
        if (authHeaders.token && authHeaders.email) {
            let tempBody = {
                username: authHeaders.email,
                tenantId: tenant?.tenantId
            };
            await axios.post(`/api/upsertUserSession`, tempBody, {}).then(res => {
                if (res.status === 200) {
                    getUserApps(authHeaders.email, tenant?.tenantId, authHeaders.token, tenant?.name);
                } else {
                    setLoading(false);
                    message.error("Something is wrong in upsertUserSession");
                };
            });
        };
    };

    return (
        <>
            {loading && <div className="absolute left-0 -top-10 flex flex-col justify-center items-center  w-full h-full bg-white-o-87 rounded-[12px]">
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1vh" }}>
                    <Skeleton.Button active style={{ width: "10vw", alignSelf: "center", height: "4`vh" }} />
                </div>
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4vh" }}>
                    <Skeleton.Button active style={{ width: "25vw", alignSelf: "center", height: "3vh" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "3vh" }}>
                    <Skeleton.Button active style={{ width: "35vw", alignSelf: "center", height: "10vh" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "3vh" }}>
                    <Skeleton.Button active style={{ width: "35vw", alignSelf: "center", height: "10vh" }} />
                </div>
            </div>}
            {multiTenantData?.length > 1 && !loading?
                <>
                    {/* <div className="h-[70px] flex items-center px-4" style={{ backgroundColor: "#101828", justifyContent: "center" }}>
                        <Image
                            src="/images/logo-white-cwsuite.png"
                            width={216}
                            height={31}
                            alt="LOGO"
                            priority
                        />
                    </div>
                    <div className="flex h-[70px] items-center px-4 mt-3 justify-between">
                        <p style={{ fontSize: "25px", color: "#1D2939", fontWeight: 600, marginLeft: "2%", font: "Inter", marginTop: "1.5%" }}>Instances</p>
                        <div className="flex items-center space-x-2 sm:space-x-4" style={{ marginRight: "2%" }}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ marginTop: "12%" }}
                            >
                                <path
                                    d="M15.5006 13.9996H14.7106L14.4306 13.7296C15.6306 12.3296 16.2506 10.4196 15.9106 8.38965C15.4406 5.60965 13.1206 3.38965 10.3206 3.04965C6.09063 2.52965 2.53063 6.08965 3.05063 10.3196C3.39063 13.1196 5.61063 15.4396 8.39063 15.9096C10.4206 16.2496 12.3306 15.6296 13.7306 14.4296L14.0006 14.7096V15.4996L18.2506 19.7496C18.6606 20.1596 19.3306 20.1596 19.7406 19.7496C20.1506 19.3396 20.1506 18.6696 19.7406 18.2596L15.5006 13.9996ZM9.50063 13.9996C7.01063 13.9996 5.00063 11.9896 5.00063 9.49965C5.00063 7.00965 7.01063 4.99965 9.50063 4.99965C11.9906 4.99965 14.0006 7.00965 14.0006 9.49965C14.0006 11.9896 11.9906 13.9996 9.50063 13.9996Z"
                                    fill="#868B8F"
                                />
                            </svg>
                            <button className="mb-2 sm:mt-[30px] h-[40px] sm:h-[45px] px-4 py-2 text-white bg-[#91C507] text-[13px] ff-inter font-bold outline-none rounded" style={{ width: "180px" }}>
                                Create New Instance
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 overflow-auto calc-height-apps">
                        {multiTenantData.map(tenant => {
                            return (
                                <div style={{ cursor: "pointer" }} onClick={handleTenant(tenant)}>
                                    <div className="border rounded p-5 ml-10 mr-10 mb-2" style={{ color: "#D3D3D3" }}>
                                        <div className="flex items-center space-x-2 sm:space-x-4 justify-between">
                                            <Image
                                                src="/images/Vector (1).png"
                                                width={35}
                                                height={30}
                                                alt="LOGO"
                                                priority
                                                className="flex-none"
                                            />
                                            <div className="flex-grow">
                                                <p style={{ color: "#101828", fontSize: "14px", fontWeight: 600 }}>{tenant.name}</p>
                                                <p style={{ color: "#101828", opacity: 0.5, fontSize: "12px" }}>{tenant.tamUser}</p>
                                            </div>
                                            <Image
                                                src="/images/Vector (2).png"
                                                width={8}
                                                height={8}
                                                alt="LOGO"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div> */}
                    <div class="grid h-screen bg-[#f3f4f9]">
                        <div className="min-w-[27rem] mt-20 mb-8 mx-auto text-center">
                            <p className="ff-inter font-semibold text-xl text-[#101828] ">Instances</p>
                            <p className=" ff-inter font-normal text-xs text-[#101828] mb-6 ">Please select an instance to continue to that account</p>
                            {multiTenantData.map(tenant => {
                                return (
                                    <div style={{ cursor: "pointer", backgroundColor: "white", boxShadow: " 0px 3px 5px rgba(0, 0, 0, 0.07)" }} onClick={handleTenant(tenant)}>
                                        <div className="border rounded p-5 mb-2" style={{ color: "#D3D3D3" }}>
                                            <div className="flex items-center space-x-2 sm:space-x-4 justify-between">
                                                <Image
                                                    src="/images/Vector (1).png"
                                                    width={35}
                                                    height={30}
                                                    alt="LOGO"
                                                    priority
                                                    className="flex-none"
                                                />
                                                <div className="flex-grow">
                                                    <p style={{ color: "#101828", fontSize: "14px", fontWeight: 600 }}>{tenant.name}</p>
                                                    <p style={{ color: "#101828", opacity: 0.5, fontSize: "12px" }}>{tenant.tamUser}</p>
                                                </div>
                                                <Image
                                                    src="/images/Vector (2).png"
                                                    width={8}
                                                    height={8}
                                                    alt="LOGO"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </> : ""
            }
        </>
    );
};
