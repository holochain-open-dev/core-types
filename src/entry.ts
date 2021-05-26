import { CapClaim, ZomeCallCapGrant } from './capabilities';
import { AgentPubKeyB64 } from './common';

export type EntryVisibility = 'Public' | 'Private';
export type AppEntryType = {
  id: number;
  zome_id: number;
  visibility: EntryVisibility;
};

export type EntryType =
  | 'Agent'
  | { App: AppEntryType }
  | 'CapClaim'
  | 'CapGrant';

export interface EntryContent<E extends string, C> {
  entry_type: E;
  content: C;
}

export type Entry =
  | EntryContent<'Agent', AgentPubKeyB64>
  | EntryContent<'App', any>
  | EntryContent<'CapGrant', ZomeCallCapGrant>
  | EntryContent<'CapClaim', CapClaim>;
