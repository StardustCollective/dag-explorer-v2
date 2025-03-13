import Link from "next/link";

import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";


export default async function NotFoundPage() {
  return (
    <PageLayout className="flex flex-col gap-10 px-20 py-8" renderAs={"main"}>
      <Section className="flex flex-col pt-20 justify-center items-center gap-6">
        <h1 className="text-9xl font-medium text-hgtp-blue-600">404</h1>
        <p className="text-xl font-medium max-w-90 text-center">
          Sorry, the page you are looking for doesn&apos;t exist. Please check
          back soon.
        </p>
        <Link className="button primary outlined xl" href="/">
          Go back to the home page
        </Link>
      </Section>
    </PageLayout>
  );
}
