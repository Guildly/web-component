export interface GuildInterface {
  name: string | undefined;
  address: string | undefined;
  emblem: string | undefined;
}

export type GuildStatus = "connected" | "disconnected";
