import clsx from "clsx";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { initDayJsLibrary } from "@/common/dayjs";
import { fontVariables } from "@/common/fonts";
import {
  getNetworkFromHeadersOrFail,
} from "@/common/network";
import { Header } from "@/components/Header";
import { NetworkHeader } from "@/components/NetworkHeader";
import { NetworkProvider } from "@/providers/NetworkProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { WalletProvider } from "@/providers/WalletProvider";

import "@/styles/globals.css";

initDayJsLibrary();

export const metadata: Metadata = {
  title: "DAG Explorer",
  description: "DAG Explorer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const network = await getNetworkFromHeadersOrFail(headers());

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="DAG Explorer" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={clsx(fontVariables, "font-inter bg-cafb")}>
        <NetworkProvider>
          <QueryProvider>
            <WalletProvider>
              <Header />
              <NetworkHeader network={network} />
              {children}
            </WalletProvider>
          </QueryProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}
