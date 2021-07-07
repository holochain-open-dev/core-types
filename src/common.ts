import { HoloHash } from "@holochain/conductor-api";

export type Dictionary<T> = {
  [key: string]: T;
};

export type HoloHashB64 = string;
export type EntryHashB64 = HoloHashB64;
export type HeaderHashB64 = HoloHashB64;
export type DhtOpHashB64 = HoloHashB64;
export type DnaHashB64 = HoloHashB64;
export type AgentPubKeyB64 = HoloHashB64;
export type AnyDhtHashB64 = HoloHashB64;
export type Signature = Uint8Array;

export type CellId = [DnaHashB64, AgentPubKeyB64];
export type EntryHash = HoloHash;
export type HeaderHash = HoloHash;