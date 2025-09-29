"use client";

import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { unparse } from "papaparse";
import { useRef, useState } from "react";

import { Calendar } from "../Calendar";
import { TextInput } from "../TextInput";
import { withErrorToast } from "../Toast";

import { datumToDag } from "@/common/currencies";
import { useClickOutside } from "@/hooks";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { getAddressTransactions } from "@/queries";
import { formatNumber, UserError } from "@/utils";
import { downloadFile } from "@/utils";

import CalendarClock4Icon from "@/assets/icons/calendar-clock-4.svg";
import CloseIcon from "@/assets/icons/close.svg";
import FileDownloadIcon from "@/assets/icons/file-download.svg";

const TransactionLimit = 3370;

export type IExportCardProps = {
  addressId: string;
  metagraphId?: string;
  onCancel?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
};

export const ExportCard = ({
  addressId,
  metagraphId,
  onCancel,
  ref,
  className,
}: IExportCardProps) => {
  const network = useNetworkContext();

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [calendarState, setCalendarState] = useState<"start" | "end" | null>(
    null
  );

  const calendarStartRef = useRef<HTMLDivElement>(null);
  const calendarEndRef = useRef<HTMLDivElement>(null);

  useClickOutside(calendarStartRef, () => setCalendarState(null));
  useClickOutside(calendarEndRef, () => setCalendarState(null));

  const downloadMutation = useMutation({
    mutationFn: withErrorToast(async () => {
      if (!startDate || !endDate) {
        throw new UserError("Start and end dates are required");
      }

      const transactions = await getAddressTransactions(
        network,
        addressId,
        metagraphId,
        { tokenPagination: { limit: TransactionLimit } }
      );

      const rangeTransactions = transactions.records.filter((trx) => {
        const date = dayjs(trx.timestamp);
        return date.isAfter(startDate) && date.isBefore(endDate.add(1, "day"));
      });

      const transactionsNormalized = rangeTransactions.map((trx) => {
        delete (trx as any).parent;
        return {
          ...trx,
          amount: datumToDag(trx.amount),
          fee: datumToDag(trx.fee),
        };
      });

      const transactionsCsv = unparse(transactionsNormalized);

      const blob = new Blob([transactionsCsv], {
        type: "text/csv;charset=utf-8;",
      });

      downloadFile(
        `transactions_${startDate.format("YYYY-MM-DD")}_to_${endDate.format(
          "YYYY-MM-DD"
        )}.csv`,
        blob
      );
    }),
  });

  //   if (dataSet.value === "rewards") {
  //     setHeaders(["date", "amount"]);
  //     const data = await getData(async () => {
  //       const response = await api.get<{
  //         data: AddressRewardsResponse[];
  //       }>(
  //         REACT_APP_DAG_EXPLORER_API_URL +
  //           "/" +
  //           network +
  //           "/addresses/" +
  //           address +
  //           "/rewards",
  //         {
  //           groupingMode: "day",
  //           startDate: startDate.toISOString().split("T")[0],
  //           endDate: endDate.toISOString().split("T")[0],
  //         }
  //       );

  //       return response.data.map((reward) => {
  //         return {
  //           date: reward.accruedAt,
  //           amount: formatAmount(reward.amount, 8, true),
  //         };
  //       });
  //     });
  //     setData(data);
  //   }

  const validRange =
    startDate &&
    endDate &&
    startDate.isBefore(endDate) &&
    endDate.isBefore(startDate.add(1, "year"));

  return (
    <div
      className={clsx("card shadow-sm w-11/12 max-w-[490px]", className)}
      ref={ref}
    >
      <div className="header flex items-center justify-between px-5 py-4.5 text-xl font-semibold text-hgtp-blue-900">
        <div className="flex items-center gap-2">
          <FileDownloadIcon className="size-8 shrink-0" />
          Export CSV data
        </div>
        <CloseIcon
          className="size-8 shrink-0 text-gray-600"
          onClick={onCancel}
        />
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="text-sm text-gray-600">
          Each export is capped at {formatNumber(TransactionLimit)}{" "}
          transactions. For larger datasets, run multiple exports with shorter
          time ranges, such as quartely. Exports are limited to 1 year.
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <TextInput
              title="Start Date"
              placeholder="Select date"
              className="text-sm"
              valueChildren={<CalendarClock4Icon className="size-5 shrink-0" />}
              value={startDate?.format("YYYY-MM-DD")}
              readOnly
              onClick={() => setCalendarState("start")}
            />
            {calendarState === "start" && (
              <div
                className="absolute card shadow-sm top-full left-0 mt-2.5 w-fit z-10"
                ref={calendarStartRef}
              >
                <Calendar
                  mode="single"
                  selected={startDate?.toDate()}
                  onSelect={(date) => {
                    setStartDate(date ? dayjs(date) : null);
                    setCalendarState(null);
                  }}
                />
              </div>
            )}
          </div>
          <div className="relative">
            <TextInput
              title="End Date"
              placeholder="Select date"
              className="text-sm"
              valueChildren={<CalendarClock4Icon className="size-5 shrink-0" />}
              value={endDate?.format("YYYY-MM-DD")}
              readOnly
              onClick={() => setCalendarState("end")}
            />
            {calendarState === "end" && (
              <div
                className="absolute card shadow-sm top-full left-0 mt-2.5 w-fit z-10"
                ref={calendarEndRef}
              >
                <Calendar
                  mode="single"
                  selected={endDate?.toDate()}
                  onSelect={(date) => {
                    setEndDate(date ? dayjs(date) : null);
                    setCalendarState(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="footer grid grid-cols-2 gap-4 px-6 py-5">
        <button className="button tertiary md" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="button secondary md"
          disabled={!validRange || downloadMutation.isPending}
          onClick={() => downloadMutation.mutate()}
        >
          {downloadMutation.isPending ? "Downloading..." : "Download data"}
        </button>
      </div>
    </div>
  );
};
