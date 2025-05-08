"use client";

import { Metadata } from "next";
import Link from "next/link";
import { useEffect } from "react";

import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";
import { isClusterUpgradeError } from "@/utils/errors";

export const metadata: Metadata = {
  title: "DAG Explorer",
  description: "DAG Explorer",
};

export default function ClientErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("UI Error Log");
    console.error(error);
    console.dir(error);
  }, [error]);

  return (
    <PageLayout className="flex flex-col gap-10 px-4 lg:px-20 py-8" renderAs={"main"}>
      {isClusterUpgradeError(error) ? (
        <Section className="flex flex-col pt-20 justify-center items-center gap-6">
          <h1 className="text-8xl font-medium text-hgtp-blue-600">
            Cluster Upgrade
          </h1>
          <p className="text-xl font-medium max-w-180 text-center">
            The cluster is currently undergoing maintenance and upgrades. This
            process may take a few minutes. Please try again later. If you
            continue to experience issues, please contact our support team.
          </p>
          <pre className="text-xs font-ibm-mono font-medium max-w-180 text-center overflow-auto border border-hgtp-blue-600 bg-hgtp-blue-600/5 rounded-md">
            {[error.digest, error.message, error.stack].join("\n")}
          </pre>
          <Link className="button primary outlined xl" href="/">
            Go back to the home page
          </Link>
        </Section>
      ) : (
        <Section className="flex flex-col pt-20 justify-center items-center gap-6">
          <h1 className="text-8xl font-medium text-hgtp-blue-600">UI Error</h1>
          <p className="text-xl font-medium max-w-180 text-center">
            Sorry, there was an internal error while loading the app, please
            reload the page. If the problem persists please contact our customer
            support channels.
          </p>
          <pre className="text-xs font-ibm-mono font-medium max-w-180 text-center overflow-auto border border-hgtp-blue-600 bg-hgtp-blue-600/5 rounded-md">
            {[error.digest, error.message, error.stack].join("\n")}
          </pre>
          <Link className="button primary outlined xl" href="/">
            Go back to the home page
          </Link>
        </Section>
      )}
    </PageLayout>
  );
}
