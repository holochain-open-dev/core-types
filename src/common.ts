export type Dictionary<T> = {
  [key: string]: T;
};

export type Hash = Uint8Array;
export type AgentPubKey = Uint8Array;
export type Signature = Uint8Array;

export type CellId = [Hash, AgentPubKey];
