import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getOAuthHeaders } from "../oAuthValidation";

export default function TenantDataLoaded() {
    const router = useRouter();
    const plgURL = process.env.NEXT_PUBLIC_COREURL;
    const appsURL = process.env.NEXT_PUBLIC_appsURL;
    const domainURL = process.env.NEXT_PUBLIC_domain;
    const daysbefore = process.env.NEXT_PUBLIC_daysbefore;
    const daysafter = process.env.NEXT_PUBLIC_daysafter;
    const { apps, menu, id, load, hideKey,primaryColor,logoUrl } = router.query;
    let paramsApps, paramsMenu, paramsId, paramsLoad,paramsKey,paramsColor,paramsLogo;
    if (apps !== undefined) {
        paramsApps = apps;
    };
    if (menu !== undefined) {
        paramsMenu = menu;
    };
    if (id !== undefined) {
        paramsId = id;
    };
    if (load !== undefined) {
        paramsLoad = load;
    };
    if (hideKey !== undefined) {
        paramsKey = hideKey;
    };
    if (primaryColor !== undefined) {
        paramsColor = decodeURIComponent(primaryColor);
    };
    if (logoUrl !== undefined) {
        paramsLogo = decodeURIComponent(logoUrl);
    }


    const getUserApps = async () => {
        const authHeaders = await getOAuthHeaders();
        if (authHeaders && authHeaders.email && authHeaders.tenantId) {
            let body = {
                username: authHeaders.email,
                tenantId: authHeaders.tenantId
            };
            var win1 = document.getElementById('myIframe1').contentWindow;
            var win2 = document.getElementById('myIframe2').contentWindow;
            axios.post(`/api/getUserApps`, body, {}).then(res => {
                let flag = "Y";
                let days = 0, index = -1;
                res?.data?.map((item, ind) => {
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
                let modifiedArray = res?.data?.map((item, ind) => {
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
                let data = { userApps: modifiedArray };
                let d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                let expires = "expires=" + d.toUTCString();
                let domain = "domain=" + domainURL;
                document.cookie = "cart" + "=" + null + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
                win1.postMessage(data, `${appsURL}`);
                win2.postMessage(data, `${plgURL}`);
            });
        }
    };

    const getMenu = async () => {
        const authHeaders = await getOAuthHeaders();
        if (authHeaders && authHeaders.token) {
            let body = {
                token: authHeaders.token,
                id: paramsId
            };
            axios.post(`/api/getMenu`, body, {}).then(res => {
                let d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                let expires = "expires=" + d.toUTCString();
                let domain = "domain=" + domainURL;
                document.cookie = "cart" + "=" + null + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
                if (Object.keys(res).length > 0) {
                    var win1 = document.getElementById('myIframe1').contentWindow;
                    var win2 = document.getElementById('myIframe2').contentWindow;
                    Object.entries(res.data).forEach(([key, value]) => {
                        let data1 = { done: paramsId };
                        let data2 = { [key]: value };
                        win1.postMessage(data1, `${appsURL}`);
                        win2.postMessage(data1, `${plgURL}`);
                        win2.postMessage(data2, `${plgURL}`);
                      });
                };
            });
        }
    };

    const settingFlag = () => {
        let d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        let domain = "domain=" + domainURL;
        document.cookie = "cart" + "=" + null + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
        var win1 = document.getElementById('myIframe1').contentWindow;
        var win2 = document.getElementById('myIframe2').contentWindow;
        let data = { done: paramsId };
        win1.postMessage(data, `${appsURL}`);
        win2.postMessage(data, `${plgURL}`);
    };
    const keyHide = () => {
        let we = localStorage.getItem("hideKey");
        var win1 = document.getElementById('myIframe1').contentWindow;
        var win2 = document.getElementById('myIframe2').contentWindow;
        if(we == "Y"){
            let data = { hideKey: "N" };
            localStorage.setItem("hideKey","N");
            win1.postMessage(data, `${appsURL}`);
            win2.postMessage(data, `${plgURL}`);
        }
        if(we == "N"){
            let data = { hideKey: "Y" };
            localStorage.setItem("hideKey","Y");
            win1.postMessage(data, `${appsURL}`);
            win2.postMessage(data, `${plgURL}`);
        }
    };
    const getColor = () => {
        var win1 = document.getElementById('myIframe1').contentWindow;
        var win2 = document.getElementById('myIframe2').contentWindow;
        let data = { primeColor : paramsColor};
        win1.postMessage(data, `${appsURL}`);
        win2.postMessage(data, `${plgURL}`);
    }

    const getLogo = () => {
        var win1 = document.getElementById('myIframe1').contentWindow;
        var win2 = document.getElementById('myIframe2').contentWindow;
        let data = { logoUrl : paramsLogo };
        win1.postMessage(data, `${appsURL}`);
        win2.postMessage(data, `${plgURL}`);
    }
    useEffect(() => {
        if (paramsApps) {
            getUserApps();
        };
        if (paramsMenu) {
            getMenu();
        };
        if (paramsLoad) {
            settingFlag();
        };
        if (paramsKey) {
            keyHide();
        };
        if(paramsColor){
            getColor();
        }
        if(paramsLogo){
            getLogo();
        }
    }, [paramsApps, paramsMenu, paramsLoad,paramsKey, paramsColor,paramsLogo]);
};