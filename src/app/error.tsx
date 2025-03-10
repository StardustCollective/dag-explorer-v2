"use client";

import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";
import Link from "next/link";
import { useEffect } from "react";

export default function ClientErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("UI Error Log");
    console.error(error);
  }, [error]);

  return (
    <PageLayout className="flex flex-col gap-10 px-20 py-8" renderAs={"main"}>
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
        <Link className="button secondary xl" href="/">
          Go back to the home page
        </Link>
      </Section>
    </PageLayout>
  );
}
