import Image from "next/image";
import React, { useState, useEffect } from "react";
import Router from 'next/router';
import { Auth } from 'aws-amplify';
import Loader from "../common/Loader";
import { message } from "antd";
// import { redirectURL } from "../serverConfig";
import { useRouter } from "next/router";

const Password = () => {
    const redirectURL = process.env.NEXT_PUBLIC_redirectURL;
    const router = useRouter();
    const { email, verify_code } = router.query;
    let paramsEmail, paramsCode;
    if (email !== undefined) {
        paramsEmail = email;
    };
    if (verify_code !== undefined) {
        paramsCode = verify_code;
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

    const handleChangePassword = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (password !== confirmPassword) {
            setPasswordsMatch(false);
        } else {
            Auth.forgotPasswordSubmit(paramsEmail, paramsCode, password)
                .then((data) => {
                    console.log(data);
                    if (data === "SUCCESS") {
                        setLoading(false);
                        Router.push("/sign-in");
                    };
                })
                .catch((err) => {
                    message.error(err.message);
                    setLoading(false);
                });
        }
    };

    return (
        <div>
            <section style={{ backgroundColor: "#f3f4f9", height: '100vh', width: '100%' }} className="  py-10 sm:py-14 h-screen">
                <div class="grid  mt-12 ">
                    {/* <div className="grid col-span-1"></div> */}
                    <div className="col-span-1">
                        <div className="   align-middle mx-6" style={{}}>
                            <div className="flex mt-8 justify-center items-center">
                                <Image
                                    src="/images/forgotPassword.svg"
                                    width={110}
                                    height={25}
                                    alt="LOGO"
                                />
                            </div>
                            <span className="flex justify-center items-center mt-3" style={{ fontWeight: 600, color: "#101828", fontSize: "1.5rem", lineHeight: "1.8rem", fontFamily: "Inter", letterSpacing: "-0.05rem" }} >Almost there!</span>
                            <span className="flex justify-center items-center " style={{ fontWeight: 400, color: "#101828", fontSize: "0.9em", lineHeight: "1.8rem", fontFamily: "Inter", letterSpacing: "-0.05rem" }} >Enter a new password for {paramsEmail}</span>
                            <div className="mx-auto max-w-md">
                                <form className="mx-5 mt-4" onSubmit={handleChangePassword}>
                                    <label className="ff-inter font-normal text-xs opacity-80 text-[#101828]">Password</label>
                                    <div className='flex items-center'>
                                        <input
                                            className="mb-1 w-full h-[40px] sm:h-[40px] px-4 py-1  border-[1px] border-[#dadada] text-[#98A2B3] rounded placeholder:text-[#98A2B3] text-xs ff-inter font-normal outline-none"
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
                                            className={`mb-1 w-full h-[40px] sm:h-[40px] px-4 py-1 border-[1px] ${passwordsMatch ? 'border-[#dadada]' : 'border-red-500'} text-[#98A2B3] rounded placeholder:text-[#98A2B3] text-xs ff-inter font-normal outline-none`}
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
                                    <button className="mb-10 flex items-center justify-center sm:mt-[18px] xs:mt-[18px] w-full h-[50px] sm:h-[50px] px-4 py-2 text-white bg-[#91C507] text-[13px] ff-inter font-bold outline-none rounded ">
                                        Change Password
                                    </button>
                                </form>
                            </div>
                        </div>
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