export declare type Dictionary<T> = {
    [key: string]: T;
};
export declare type Hash = Uint8Array;
export declare type AgentPubKey = Uint8Array;
export declare type CellId = [AgentPubKey, Hash];
export declare function getAgentPubKey(cellId: CellId): AgentPubKey;
export declare function getDnaHash(cellId: CellId): Hash;
