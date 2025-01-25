import React from "react";
import "../styles/globals.css";
import "instantsearch.css/themes/satellite-min.css";
import Menu from '../components/Menu'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Menu />
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
