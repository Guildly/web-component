import { useState } from "react";
import { GuildInterface } from "../guild/types";
import { AccountInterface } from "starknet";
import { useAccount } from "@starknet-react/core";
import { client } from "../services/apolloClient";
import { getGuildsByAccount } from "../services/graphql/queries";

export interface GuildsState {
  /** The guilds that an account is part of. */
  guilds: GuildInterface[];
  /** The guilds that the connected account is part of. */
  getGuilds: () => void;
}

export function useGuilds() {
  const { account } = useAccount();
  const [guilds, setGuilds] = useState<GuildInterface>({
    name: undefined,
    address: undefined,
    emblem: undefined,
  });

  const getGuilds = () => {
    client
      .query({
        query: getGuildsByAccount,
        variables: {
          account: account,
        },
      })
      .then((response) => {
        setGuilds(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return {
    guilds,
    getGuilds,
  };
}
