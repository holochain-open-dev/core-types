import {
  AgentPubKeyB64,
  Dictionary,
  EntryHashB64,
  HeaderHashB64,
  HoloHashB64,
} from './common';
import { NewEntryHeader } from './header';
import { Timestamp } from './timestamp';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/state/metadata.rs

export interface Metadata {
  // Stores an array of headers indexed by entry hash
  system_meta: Dictionary<SysMetaVal[]>;
  link_meta: Array<{ key: LinkMetaKey; value: LinkMetaVal }>;
  misc_meta: Dictionary<MiscMetaVal>;
}

export type SysMetaVal =
  | {
      NewEntry: HeaderHashB64;
    }
  | {
      Update: HeaderHashB64;
    }
  | {
      Delete: HeaderHashB64;
    }
  | {
      Activity: HeaderHashB64;
    }
  | {
      DeleteLink: HeaderHashB64;
    }
  | {
      CustomPackage: HeaderHashB64;
    };

export function getSysMetaValHeaderHash(
  sys_meta_val: SysMetaVal
): HeaderHashB64 | undefined {
  if ((sys_meta_val as { NewEntry: HeaderHashB64 }).NewEntry)
    return (sys_meta_val as { NewEntry: HeaderHashB64 }).NewEntry;
  if ((sys_meta_val as { Update: HeaderHashB64 }).Update)
    return (sys_meta_val as { Update: HeaderHashB64 }).Update;
  if ((sys_meta_val as { Delete: HeaderHashB64 }).Delete)
    return (sys_meta_val as { Delete: HeaderHashB64 }).Delete;
  if ((sys_meta_val as { Activity: HeaderHashB64 }).Activity)
    return (sys_meta_val as { Activity: HeaderHashB64 }).Activity;
  return undefined;
}

export interface LinkMetaKey {
  base: EntryHashB64;
  zome_id: number;
  tag: any;
  header_hash: HeaderHashB64;
}

export interface LinkMetaVal {
  link_add_hash: HeaderHashB64;
  target: EntryHashB64;
  timestamp: Timestamp;
  zome_id: number;
  tag: any;
}

export type MiscMetaVal =
  | {
      EntryStatus: EntryDhtStatus;
    }
  | 'StoreElement'
  | { ChainItem: Timestamp }
  | { ChainObserved: HighestObserved }
  | { ChainStatus: ChainStatus };

export enum ChainStatus {
  Empty,
  Valid,
  Forked,
  Invalid,
}

export interface HighestObserved {
  header_seq: number;
  hash: HeaderHashB64[];
}

export enum EntryDhtStatus {
  Live,
  /// This [Entry] has no headers that have not been deleted
  Dead,
  /// This [Entry] is awaiting validation
  Pending,
  /// This [Entry] has failed validation and will not be served by the DHT
  Rejected,
  /// This [Entry] has taken too long / too many resources to validate, so we gave up
  Abandoned,
  /// **not implemented** There has been a conflict when validating this [Entry]
  Conflict,
  /// **not implemented** The author has withdrawn their publication of this element.
  Withdrawn,
  /// **not implemented** We have agreed to drop this [Entry] content from the system. Header can stay with no entry
  Purged,
}

export interface CoreEntryDetails {
  headers: NewEntryHeader[];
  links: LinkMetaVal[];
  dhtStatus: EntryDhtStatus;
}
