import "../styles/globals.css";
require("@solana/wallet-adapter-react-ui/styles.css");

import React from "react";

import { Toaster } from "react-hot-toast";

// You can use any of the other enpoints here

import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-left" reverseOrder={true} />

      <div className={`${inter.className} dark`}>
        {/* <WalletMultiButton className="btn" /> */}
        {/* <div className="w-full px-4 py-2 border-b-2">
              <div className="flex flex-row flex-wrap space-x-4">
                <div className="inline">
                  {ActiveLink({
                    href: "/",
                    children: "Markets",
                  })}
                </div>
                <div className="inline">
                {ActiveLink({
                    href: "/create_market",
                    children: "Create Market",
                  })}
                </div>
                <div className="inline">
                  {ActiveLink({
                    href: "/old",
                    children: "Markets",
                  })}
                </div>
              </div>
            </div> */}
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}
