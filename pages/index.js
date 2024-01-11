import React, { useState, useEffect } from "react";
import Router from "next/router";
// import { redirectURL } from "../serverConfig";
import Loader from "../common/Loader";

function Home() {
  const redirectURL = process.env.NEXT_PUBLIC_redirectURL;
  const [loading, setLoading] = useState(false);

  const check = async () => {
    try {
      await Auth.currentSession();
      setLoading(false);
      Router.push(`${redirectURL}`);
    } catch (error) {
      Router.push('/sign-in');
    };
  };

  useEffect(() => {
    setLoading(true);
      check();
  }, []);

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
}

export default Home;