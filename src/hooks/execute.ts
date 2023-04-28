import { useMutation } from "@tanstack/react-query";
import { AccountInterface, InvokeFunctionResponse } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useGuild } from "../guild/useGuild";
import { GuildInterface } from "../guild/types";

/** Represents a contract call. */
export interface Call {
  /** The address of the contract. */
  contractAddress: string;
  /** The selector of the function to invoke. */
  entrypoint: string;
  /** The raw calldata. */
  calldata: unknown[];
}

/** Arguments for `useContractWrite`. */
export interface UseContractWriteArgs {
  /** List of smart contract calls to execute. */
  calls?: Call | Call[];
  /** Metadata associated with the transaction. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

/** Value returned from `useContractWrite` */
export interface UseContractWriteResult {
  /** Data returned from the execute call. */
  data?: string;
  /** True if the execute call is being executed. */
  isLoading: boolean;
  /** Error while running execute. */
  error?: unknown;
  /** Reset the hook state. */
  reset: () => void;
  /** Execute the calls. */
  write: ((args?: UseContractWriteArgs) => void) | undefined;
  writeAsync:
    | ((args?: UseContractWriteArgs) => Promise<InvokeFunctionResponse>)
    | undefined;
  isError: boolean;
  isIdle: boolean;
  isSuccess: boolean;
  status: "idle" | "error" | "loading" | "success";
}

export function useContractWrite({ calls, metadata }: UseContractWriteArgs) {
  const { account } = useAccount();
  const { guild } = useGuild();
  const {
    data,
    isLoading,
    error,
    reset,
    mutate,
    mutateAsync,
    isIdle,
    isSuccess,
    status,
    isError,
  } = useMutation(writeContract({ account, guild, args: { calls, metadata } }));

  return {
    data,
    error: error ?? undefined,
    reset,
    write: mutate,
    writeAsync: mutateAsync,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    status,
  };
}

function writeContract({
  account,
  guild,
  args,
}: {
  account?: AccountInterface;
  guild?: GuildInterface;
  args: UseContractWriteArgs;
}) {
  return async () => {
    const { calls, metadata } = args;
    if (account === undefined) {
      throw new Error("No connector connected");
    }
    if (calls === undefined) {
      throw new Error("No calls specified");
    }
    /** Here we add the proxy logic to forward a transaction through a guild. */
    if (Array.isArray(calls)) {
      const guildCalls = [];
      for (const call of calls) {
        const formatCall: Call = {
          contractAddress: guild.address,
          entrypoint: "execute",
          calldata: Object.values(call),
        };
        guildCalls.push(formatCall);
      }
      const response = await account.execute(guildCalls);
      console.warn(`TODO: ignoring metadata`, metadata);
      return response;
    } else {
      const formatCall: Call = {
        contractAddress: guild.address,
        entrypoint: "execute",
        calldata: Object.values(calls),
      };
      const response = await account.execute(formatCall);
      console.warn(`TODO: ignoring metadata`, metadata);
      return response;
    }
  };
}
