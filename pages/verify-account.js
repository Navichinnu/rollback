import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import Router from 'next/router';
import Loader from "../common/Loader";
import { message } from "antd";
// import { redirectURL } from "../serverConfig";
import { useRouter } from "next/router";

export default function Verify() {
  const redirectURL = process.env.NEXT_PUBLIC_redirectURL;
  const router = useRouter();
  const { username, verify_code } = router.query;
  let paramsUsername, paramsCode;
  if (username !== undefined) {
    paramsUsername = decodeURIComponent(username);
  };
  if (verify_code !== undefined) {
    paramsCode = verify_code;
  };
  const [loading, setLoading] = useState(true);

  const check = async () => {
    try {
      await Auth.currentSession();
      setLoading(false);
      Router.push(`${redirectURL}`);
    } catch (error) {
      Router.push(`${window.location.href}`);
    };
  };

  useEffect(() => {
    setLoading(true);
    if (paramsUsername && paramsCode) {
      check();
    };
  }, [paramsUsername]);

  const verifyUser = async () => {
    setLoading(true);
    try {
      await Auth.confirmSignUp(paramsUsername, paramsCode);
      setLoading(false);
      Router.push({
        pathname: '/create-password',
        query: { username: paramsUsername }
      });
    } catch (err) {
      message.error(err.message);
      setLoading(false);
    };
  };

  useEffect(() => {
    if (paramsUsername && paramsCode) {
      verifyUser();
    };
  }, [paramsUsername]);

  return (
    <div>
      {loading === true ?
        <div className="absolute left-0 top-0 flex flex-col justify-center items-center  w-full h-full bg-white-o-87 rounded-[12px]">
          <Loader />
        </div> :
        ""
      }
    </div>
  );
};