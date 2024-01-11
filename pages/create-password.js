import Image from "next/image";
import React, { useEffect, useState } from "react";
import Router from 'next/router';
import { Auth } from 'aws-amplify';
// import { redirectURL } from "../serverConfig";
import Loader from "../common/Loader";
import { message } from "antd";
import { useRouter } from "next/router";

const Password = () => {
    const redirectURL = process.env.NEXT_PUBLIC_redirectURL;
    const router = useRouter();
    const { username } = router.query;
    let paramsUsername;
    if (username !== undefined) {
        paramsUsername = username;
    };
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isFirstPasswordValid, setIsFirstPasswordValid] = useState(false);

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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    function isValidPassword(password) {
        // Define your password complexity criteria here
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+[\]{};':"\\|,.<>?/~`\-=/]/.test(password);
    
        return (
            password.length >= minLength &&
            hasUppercase &&
            hasLowercase &&
            hasNumber &&
            hasSymbol
        );
    }

    const handleLogin = async (event) => {
        setLoading(true);
        event.preventDefault();
        if (password !== confirmPassword) {
            setPasswordsMatch(false);
        } else {
            await Auth.signIn(paramsUsername, '86!}gkkVPD}3');
            Auth.currentAuthenticatedUser()
                .then((user) => {
                    return Auth.changePassword(user, '86!}gkkVPD}3', password);
                })
                .then((data) => {
                    if (data === "SUCCESS") {
                        Router.push("/choose-tenant");
                    };
                })
                .catch((err) => {
                    message.error(err.message);
                    setLoading(false);
                });
        };
    };

    return (
        <div>
        <section style={{ height: '100vh', width: '100%' }} className="bg-[#f3f4f9]  py-10 sm:py-14 h-screen">
            <div class="grid  mt-12 ">
                {/* <div className="grid col-span-1"></div> */}
                <div class=" max-w-[27rem] mx-auto bg-[#F3F4F9]  ">
                    {/* <div className="bg-white align-middle mx-6" style={{ boxShadow: '0px 0px 59px 2px rgba(0, 0, 0, 0.1)', border: "1px solid #E2E2E2" }}> */}
                        <div className="flex mt-5 justify-center items-center mb-4">
                            <Image
                                src="/images/createPassword.png"
                                width={170}
                                height={210}
                                alt="LOGO"
                            />
                        </div>
                        <span className="flex justify-center items-center " style={{ fontWeight: 600, color: "#101828", fontSize: "1.5rem", lineHeight: "1.8rem", fontFamily: "Inter", letterSpacing: "-0.05rem" }} >Your account is almost ready!</span>
                        <span className="flex justify-center items-center " style={{ fontWeight: 400, color: "#101828", fontSize: "0.9em", lineHeight: "1.8rem", fontFamily: "Inter", letterSpacing: "-0.05rem" }} > Please set a password for {paramsUsername}</span>
                        <div className="mx-auto max-w-md">
                            <form className="mx-11 mt-4" onSubmit={handleLogin}>
                                <label className="ff-inter font-normal text-xs opacity-80 text-[#101828]">Password</label>
                                <div className='flex items-center'>
                                    <input
                                        className="mb-1 w-full h-[55px] sm:h-[40px] px-4 py-1  border-[1px] border-[#C4C4C4] text-[#98A2B3] rounded placeholder:text-[#98A2B3] text-xs ff-inter font-normal outline-none"
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(ev) => { setPassword(ev.target.value) }}
                                        onBlur={() => {
                                            const isValid = isValidPassword(password);
                                            setIsFirstPasswordValid(isValid);
                                            // if (!isValidPassword(password)) {
                                            //     // Display error message or handle invalid password
                                            //     message.error(" Password must have a minimum of 8 characters with a combination of uppercase and lowercase letters, numbers, and symbols.");
                                            // }
                                        }}
                                    />
                                    <img
                                        onClick={togglePasswordVisibility}
                                        className='-ml-9'
                                        src={showPassword ? '/images/slash.png' : '/images/eye.png'}
                                        alt={showPassword ? "Hide password" : "Show password"}
                                        style={{ cursor: "pointer" }}
                                        width={showPassword?16:15}
                                    />
                                </div>
                                <p className={`ff-inter text-[9.5px]`}>Use a minimum of 8 characters with a combination of uppercase and lowercase letters, numbers, and symbols</p>
                                <br />
                                <label className="ff-inter font-normal text-xs opacity-80 text-[#101828]">Confirm Password</label>
                                <div className='flex items-center'>
                                    <input
                                        className={`mb-1 w-full h-[55px] sm:h-[40px] px-4 py-1 border-[1px] ${passwordsMatch ? 'border-[#C4C4C4]' : 'border-red-500'} text-[#98A2B3] rounded placeholder:text-[#98A2B3] text-xs ff-inter font-normal outline-none`}
                                        required
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        // disabled={!isFirstPasswordValid}
                                        onChange={(ev) => {
                                            setConfirmPassword(ev.target.value);
                                            if (ev.target.value === password) {
                                                setPasswordsMatch(true);
                                            } else {
                                                setPasswordsMatch(false);
                                            }
                                        }}
                                    />
                                    <img
                                        onClick={toggleConfirmPasswordVisibility}
                                        className='-ml-9'
                                        src={showConfirmPassword ? '/images/slash.png' : '/images/eye.png'}
                                        alt={showConfirmPassword ? "Hide password" : "Show password"}
                                        style={{ cursor: "pointer" }}
                                        width={showConfirmPassword?16:15}
                                    />
                                </div>
                                {!passwordsMatch && <p style={{ fontSize: "10px", color: "red", marginTop: "-3px" }}>Passwords do not match.</p>}
                                <button className="mb-10 flex items-center justify-center sm:mt-[18px] w-full h-[50px] sm:h-[50px] px-4 py-2 text-white bg-[#91C507] text-[13px] ff-inter font-bold outline-none rounded ">
                                    Login
                                </button>
                            </form>
                        </div>
                    {/* </div> */}
                </div>
                {/* <div className="grid col-span-1"></div> */}
            </div>
        </section>
        {loading === true ?
            <div className="absolute left-0 top-0 flex flex-col justify-center items-center  w-full h-full bg-white-o-87 rounded-[12px]">
                <Loader />
            </div> :
            ""
        }
    </div>
    );
};

export default Password;