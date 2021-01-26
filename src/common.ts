export type Dictionary<T> = {
  [key: string]: T;
};

export type Hash = string;
export type AgentPubKey = string;
export type Signature = Uint8Array;

export type CellId = [Hash, AgentPubKey];
