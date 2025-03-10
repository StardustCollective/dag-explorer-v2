"use client";
import type { Metadata } from "next";

import clsx from "clsx";

import { Header } from "@/components/Header";
import { fontVariables } from "@/common/fonts";
import "@/styles/globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { WalletProvider } from "@/providers/WalletProvider";

import { initDayJsLibrary } from "@/common/dayjs";
import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";
import { useEffect } from "react";
import Link from "next/link";

initDayJsLibrary();

export const metadata: Metadata = {
  title: "DAG Explorer",
  description: "DAG Explorer",
};

export default function GlobalErrorLayout({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Log");
    console.error(error);
  }, [error]);

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
        <QueryProvider>
          <WalletProvider>
            <Header />
            <PageLayout
              className="flex flex-col gap-10 px-20 py-8"
              renderAs={"main"}
            >
              <Section className="flex flex-col pt-20 justify-center items-center gap-6">
                <h1 className="text-8xl font-medium text-hgtp-blue-600">
                  Unknown Error
                </h1>
                <p className="text-xl font-medium max-w-180 text-center">
                  Sorry, there was an unknown error detected, please reload the
                  page. If the problem persists please contact our customer
                  support channels.
                </p>
                <pre className="text-xs font-ibm-mono font-medium max-w-180 text-center overflow-auto border border-hgtp-blue-600 bg-hgtp-blue-600/5 rounded-md">
                  {[error.digest, error.message, error.stack].join("\n")}
                </pre>
                <Link className="button secondary xl" href="/">
                  Go back to the home page
                </Link>
              </Section>
            </PageLayout>
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
