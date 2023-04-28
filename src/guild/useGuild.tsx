import React, { createContext, useContext, useState, useCallback } from "react";
import { GuildInterface, GuildStatus } from "./types";

export interface GuildState {
  /** The connected guild object. */
  guild?: GuildInterface;
  /** The set state action to connect a guild. */
  connect: (guild: GuildInterface) => void;
  /** The set state action to disconnect a guild. */
  disconnect: (guild: GuildInterface) => void;
  /** The connection status. */
  guildStatus: GuildStatus;
}

const GUILD_INITIAL_STATE: GuildState = {
  guild: undefined,
  connect: () => undefined,
  disconnect: () => undefined,
  guildStatus: "disconnected",
};

const GuildContext = createContext<GuildState>(GUILD_INITIAL_STATE);

export function useGuild(): GuildState {
  return useContext(GuildContext);
}

export const useGuildContext = () => {
  const [guild, setGuild] = useState<GuildInterface>({
    name: undefined,
    address: undefined,
    emblem: undefined,
  });

  const [guildStatus, setGuildStatus] = useState<GuildStatus>("disconnected");

  const connect = (guild: GuildInterface) => {
    setGuild(guild);
    setGuildStatus("connected");
  };

  const disconnect = (guild: GuildInterface) => {
    setGuild(undefined);
    setGuildStatus("disconnected");
  };

  return {
    guild,
    connect,
    disconnect,
    guildStatus,
  };
};

export function GuildProvider({ children }: { children: React.ReactNode }) {
  const state = useGuildContext();
  return (
    <GuildContext.Provider value={state}>{children}</GuildContext.Provider>
  );
}
