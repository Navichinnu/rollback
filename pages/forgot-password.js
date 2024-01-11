import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Auth } from 'aws-amplify';
import Loader from "../common/Loader";
import Router from 'next/router';
import { message } from "antd";
// import { redirectURL } from "../serverConfig";

const ForgotPassword = () => {
    const redirectURL = process.env.NEXT_PUBLIC_redirectURL;
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [msgFlag, setMsgFlag] = useState(false);

    const check = async () => {
        try {
            await Auth.currentSession();
            setLoading(false);
            Router.push(`${redirectURL}`);
        } catch (error) {
            setLoading(false);
            Router.push(`${window.location.href}`);
        };
    };

    useEffect(() => {
        setLoading(true);
        check();
    }, []);

    const handleContinue = async (event) => {
        event.preventDefault();
        setLoading(true);
        Auth.forgotPassword(email)
            .then((data) => {
                console.log(data);
                setMsgFlag(true);
                setLoading(false);
            })
            .catch((err) => {
                message.error(err.message);
                setLoading(false);
            });
    };

    const handleLogin = () => {
        setLoading(true);
        Router.push(`/sign-in`);
    };

    return (
        <>
            <section style={{ height: '100vh', width: '100%' }} className="bg-[#f3f4f9]  py-10 sm:py-14 h-screen">
                <div class="grid  mt-12 ">
                    <div className=" max-w-[27rem] mx-auto  bg-[#F3F4F9]  ">
                        <div className=" align-middle mx-3" style={{}}>
                            <div className="flex mt-10 justify-center items-center">
                                <Image
                                    src="/images/forgotPassword.svg"
                                    width={160}
                                    height={25}
                                    alt="LOGO"
                                />
                            </div>
                            {msgFlag === false ?
                                <p className="flex justify-center items-center mt-5" style={{ fontWeight: 600, color: "#101828", fontSize: "2rem", lineHeight: "1.8rem", fontFamily: "Inter", letterSpacing: "-0.05rem" }}>Can’t log in?</p> :
                                <>
                                    <span className="flex justify-center items-center mt-5" style={{ fontWeight: 600, color: "#101828", fontSize: "1.3rem", lineHeight: "1.8rem", fontFamily: "Inter", letterSpacing: "-0.05rem" }}>Password reset link sent!</span>
                                    <p className="flex justify-center items-center " style={{ fontWeight: 400, color: "#475467", fontSize: "0.9rem", fontFamily: "Inter" }}>Please check your Email</p>
                                </>
                            }
                            <div className="mx-auto max-w-md">
                                <form className="mx-10 mt-8" onSubmit={handleContinue}>
                                    {msgFlag === false ?
                                        <label className="ff-inter font-normal text-xs opacity-80 text-[#101828]">We’ll send a password reset link to</label> :
                                        <label className="ff-inter font-normal text-xs opacity-80 text-[#101828]">Reset link sent to</label>}
                                    <input
                                        className="w-full h-[40px] sm:h-[45px] px-4 py-1 border-[1px] border-[#C4C4C4] text-[#101828] rounded placeholder:text-[#98A2B3] text-xs ff-inter outline-none font-normal"
                                        required
                                        type={'text'}
                                        value={email}
                                        placeholder="Enter Email"
                                        onChange={(ev) => { setEmail(ev.target.value) }}
                                    />
                                    <button onClick={handleContinue} className="mb-2 flex items-center justify-center xs:mt-[20px] sm:mt-[20px] w-full h-[50px] sm:h-[50px] px-4 py-2 text-white bg-[#91C507] text-[15px] ff-inter font-bold outline-none rounded" disabled={msgFlag === false ? false : true} style={{ opacity: msgFlag === false ? "100%" : "27%" }}>
                                        Send reset link
                                    </button>
                                    <div className="mb-7 grid grid-cols-2" >
                                        <a onClick={handleLogin} className="text-[#0500ED] ff-inter text-xs col-span-1" style={{ cursor: "pointer" }}>Back to Login</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {loading === true ?
                <div className="absolute left-0 top-0 flex flex-col justify-center items-center  w-full h-full bg-white-o-87 rounded-[12px]">
                    <Loader />
                </div> :
                ""
            }
        </>
    );
};

export default ForgotPassword;