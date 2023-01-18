import Router, { useRouter } from "next/router";
import { useState } from "react";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import { SplashScreen } from "../components";
import { RelayProvider } from "../context/RelayContext";
import { TuneProvider } from "../context/TuningContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TwetchProvider } from "../context/TwetchContext";
import { BitcoinProvider } from "../context/BitcoinContext";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  /*  const [loading, setLoading] = useState(false);
  const router = useRouter();

  Router.events.on("routeChangeStart", (url) => {
    if (url.startsWith("/t")) {
      setLoading(true);
    }
  });
  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
  }); */

  return (
    <>
      <Head>
        <title>Peafowl Excellence Podcast</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        src="https://one.relayx.io/relayone.js"
        strategy="beforeInteractive"
      />
      <Script src="https://unpkg.com/@hastearcade/web/dist/umd/index.js" strategy="beforeInteractive"
 />
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        disableTransitionOnChange
      >
        <TwetchProvider>
          <RelayProvider>
            <BitcoinProvider>
              <TuneProvider>
                <Component {...pageProps} />
              </TuneProvider>
            </BitcoinProvider>
          </RelayProvider>
        </TwetchProvider>
        <ToastContainer />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
