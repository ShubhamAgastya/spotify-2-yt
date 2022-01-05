import "../styles/globals.css";
import {SessionProvider} from "next-auth/react";
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps: {session, ...pageProps} }
  ) {
  return (
    //higher order component, it wraps all the other things
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp
