import "../styles/globals.css";
import "../styles/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loader from "../common/Loader";
// import { plgURL, appsURL, posURL } from "../serverConfig";
import Head from "next/head";
import Home from "../pages/index";
const domain = process.env.NEXT_PUBLIC_domain;
Amplify.configure({
  ...awsconfig,
  ssr: true,
  cookieStorage: {
    domain: domain,
    path: '/',
    expires: 365,
    sameSite: 'strict',
    secure: true,
    httpOnly: true
  },
});

function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const plgURL = process.env.NEXT_PUBLIC_COREURL;
  const appsURL = process.env.NEXT_PUBLIC_appsURL;
  const posURL = process.env.NEXT_PUBLIC_posURL;
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>CW Suite - Authentication</title>
      </Head>
      {loading && <div className="absolute left-0 top-0 flex flex-col justify-center items-center  w-full h-full bg-white-o-87 rounded-[12px]"><Loader /></div>}
      <iframe src={`${appsURL}getlocalstorage.html`} id="myIframe1" style={{ display: 'none' }}></iframe>
      <iframe src={`${plgURL}getlocalstorage.html`} id="myIframe2" style={{ display: 'none' }}></iframe>
      <iframe src={`${posURL}getlocalstorage.html`} id="myIframe3" style={{ display: 'none' }}></iframe>
      {router.route === "/_error" ? <Home /> : <Component {...pageProps} />}
    </>
  );
}

export default App;