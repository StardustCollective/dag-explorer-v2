import Link from "next/link";

import { PageLayout } from "../PageLayout";

import ConstellationIcon from "@/assets/logos/constellation.svg";

export type IFooterProps = Record<string, never>;

export const Footer = ({}: IFooterProps) => {
  return (
    <div className="flex flex-col justify-end grow-1">
      <PageLayout
        className={{
          children:
            "flex flex-col md:flex-row justify-between items-center h-20 px-4 md:px-20 text-hgtp-blue-900 text-xs",
        }}
      >
        <div>© {new Date().getFullYear()} Constellation Network</div>
        <div className="flex items-center gap-2">
          Powered by <ConstellationIcon className="size-7.5" /> Constellation
        </div>
        <Link
          className="underline text-hgtp-blue-600"
          href="https://forms.gle/NPP68a3NUeSD9YVb6"
        >
          Submit a Metagraph
        </Link>
      </PageLayout>
    </div>
  );
};
