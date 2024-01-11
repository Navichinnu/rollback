import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Router from 'next/router';
import { LeftArrow } from "../common/Icons";
import { Auth } from 'aws-amplify';
// import { redirectURL } from "../serverConfig";
import Loader from "../common/Loader";
import { message } from "antd";
import { useRouter } from "next/router";

const ThankYou = () => {
  const redirectURL = process.env.NEXT_PUBLIC_redirectURL;
  const router = useRouter();
  const { username } = router.query;
  let paramsUsername;
  if (username !== undefined) {
    paramsUsername = username;
  };
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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

  const handleChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    if (e.target.value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyUp = async (e, index) => {
    if (index === otp.length - 1 && otp[index] !== '') {
      setLoading(true);
      const otpValue = otp.join('');
      try {
        await Auth.confirmSignUp(paramsUsername, otpValue);
        setLoading(false);
        Router.push({
          pathname: '/create-password',
          query: { username: paramsUsername }
        });
      } catch (err) {
        message.error(err.message);
        setLoading(false);
      };
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain').trim();
    const newOtp = [];
    for (let i = 0; i < otp.length; i++) {
      if (i < pastedText.length) {
        newOtp[i] = pastedText.charAt(i);
      } else {
        newOtp[i] = '';
      };
    };
    setOtp(newOtp);
    const nextIndex = Math.min(index + pastedText.length, otp.length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <>
      {loading && <div className="absolute left-0 top-0 flex flex-col justify-center items-center  w-full h-full bg-white-o-87 rounded-[12px]"><Loader /></div>}
     
      <div style={{ height: "87vh", background: "linear-gradient(180deg, #F3F6FF 0%, rgba(242, 254, 255, 0) 100%)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Image src="/images/createPassword.png" width={150} height={210}/>
        <span style={{ fontWeight: 600, fontSize: "2.3rem",marginTop:"1em"}}>Thank you for signing up!</span>
        <p style={{ fontSize: "1rem", color: "#101828", fontWeight: 500, opacity: "76%", marginTop: "2%", width: "54%", lineHeight: "1rem", fontFamily: "Inter" }} >To complete the verification process, please follow one of the options below:</p>
        <p style={{ fontSize: "1rem", color: "#101828", fontWeight: 500, opacity: "76%", marginTop: "3%", width: "85%", lineHeight: "1rem", fontFamily: "Inter" }} ><span style={{fontWeight:600}}>1. Verify Email via Link:</span> Check your email inbox for a verification email. Click on the verification link provided in the email to confirm your email address</p>
        <p style={{ fontSize: "1rem", color: "#101828", fontWeight: 500, opacity: "76%", marginTop: "2%", width: "89%", lineHeight: "1rem", fontFamily: "Inter" }} ><span style={{fontWeight:600}}>2. Verify Email via OTP:</span> If you prefer to verify using an OTP, enter the OTP code provided in the email into the field below</p>
        <div className="grid grid-cols-6 gap-2" style={{ marginTop: "2%" }}>
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              disabled={loading}
              className="border rounded h-16 w-11 text-center text-xl otp-input"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onKeyUp={(e) => handleKeyUp(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              ref={(el) => inputRefs.current[index] = el}
            />
          ))}
        </div>
        <p className="mx-32" style={{ fontSize: "0.74rem", color: "#101828", fontWeight: 400, marginTop: "3%", fontFamily: "Inter" }}>If you haven't received the verification email, please check your spam or junk folder. It may take a few minutes for the email to arrive. If you still encounter issues, please <a href="" target="" rel="" style={{ color: "#0500ED", textDecoration: "underline" }}>Contact Us</a> for assistance. Thank you for choosing our B2B SaaS application!.</p>
      </div>
    </>
  );
};

export default ThankYou;