import { useState } from "react";
import { GuildInterface } from "../guild/types";
import { AccountInterface } from "starknet";
import { useAccount } from "@starknet-react/core";
import { client } from "../services/apolloClient";
import { getDataByContract } from "../services/graphql/queries";

export interface DataInterface {
  contractAddress: any;
  entrypoint: any;
  response: any[];
}

export interface GameState {
  /** The guilds that an account is part of. */
  data: DataInterface[];
}

/** Arguments for the `getData` function. */
export interface DataArgs {
  /** The args the data query is called with. */
  contract: string;
}

export function useGame({ contract }: DataArgs) {
  const [data, setData] = useState<DataInterface>({
    contractAddress: undefined,
    entrypoint: undefined,
    response: undefined,
  });

  const getData = () => {
    client
      .query({
        query: getDataByContract,
        variables: {
          contract: contract,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return {
    data,
    getData,
  };
}
