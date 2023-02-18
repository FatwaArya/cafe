import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";


import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

import { api } from "../utils/api";

import AuthGuard from "../components/auth/AuthGuard";
import "../styles/globals.css";


export type WikuPage<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  authRequired?: boolean;
  role?: string;
};

type WikuAppProps = AppProps & {
  Component: WikuPage;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: WikuAppProps) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const authRequired = Component.authRequired ?? false;
  const role = Component.role ?? "";
  return (
    //return getLayout with session provider
    <SessionProvider session={session}>
      {
        authRequired && role ? (
          <AuthGuard role={role}>
            {getLayout(<Component {...pageProps} />)}
          </AuthGuard>
        ) : (
          getLayout(<Component {...pageProps} />)
        )
      }
    </SessionProvider>
  );
};


export default api.withTRPC(MyApp);
