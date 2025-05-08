"use client";

import clsx from "clsx";
import { useState } from "react";

import { ExportCard } from "@/components/ExportCard";

import FileDownloadIcon from "@/assets/icons/file-download.svg";

export type IExportModalButtonProps = {
  addressId: string;
  metagraphId?: string;
};

export const ExportModalButton = ({
  addressId,
  metagraphId,
}: IExportModalButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={clsx(
          "hidden lg:flex",
          "button primary outlined",
          "items-center gap-1 px-4 py-1.5",
          "text-hgtp-blue-900 hover:text-white text-sm",
          "mr-6"
        )}
        onClick={() => setOpen((s) => !s)}
      >
        Export CSV <FileDownloadIcon className="size-5 shrink-0" />
      </button>
      {open && (
        <div className="modal">
          <ExportCard
            addressId={addressId}
            metagraphId={metagraphId}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
};
