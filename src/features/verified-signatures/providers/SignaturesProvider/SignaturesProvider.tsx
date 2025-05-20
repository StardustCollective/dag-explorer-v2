"use client";

import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

import { useNetworkContext } from "@/providers/NetworkProvider";
import { getSignatures, IVerifiedSignature } from "@/queries/actions/signatures";
import { IAPIResponseData } from "@/types";

export type ISignaturesContext = {
  signaturesQuery: UseQueryResult<IAPIResponseData<IVerifiedSignature>, Error>;
  signatures: IVerifiedSignature[] | null;
  resetSignatures: () => void;
};

const SignaturesContext = createContext<ISignaturesContext | null>(null);

export const SignaturesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const network = useNetworkContext();

  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  const queryClient = useQueryClient();
  const signaturesQuery = useQuery({
    queryKey: ["verified-signatures", network, limit, page],
    queryFn: () =>
      getSignatures(network, {
        tokenPagination: { limit, next: nextPageToken },
      }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  return (
    <SignaturesContext.Provider
      value={{
        signaturesQuery,
        signatures: signaturesQuery.data?.records ?? null,
        resetSignatures: () => {
          setLimit(20);
          setPage(0);
          setNextPageToken(undefined);
          queryClient.invalidateQueries({ queryKey: ["verified-signatures"] });
          signaturesQuery.refetch();
        },
      }}
    >
      {children}
    </SignaturesContext.Provider>
  );
};

export const useSignaturesProvider = () => {
  const context = useContext(SignaturesContext);

  if (!context) {
    throw new Error(
      "useSignaturesProvider() calls must be done under a <SignaturesProvider/> component"
    );
  }

  return context;
};
