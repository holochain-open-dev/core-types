export type Dictionary<T> = {
  [key: string]: T;
};

export type Hash = Uint8Array;
export type AgentPubKey = Uint8Array;

export type CellId = [AgentPubKey, Hash];

export function getAgentPubKey(cellId: CellId): AgentPubKey {
  return cellId[0];
}

export function getDnaHash(cellId: CellId): Hash {
  return cellId[1];
}
