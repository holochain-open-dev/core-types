import {
  Create,
  CreateLink,
  Delete,
  DeleteLink,
  Header,
  HeaderType,
  NewEntryHeader,
  SignedHeaderHashed,
  Update,
} from "./header";
import { Element } from "./element";
import { Entry } from "./entry";
import { HoloHashed } from "./hashed";
import { Signature } from "./common";

// https://github.com/holochain/holochain/blob/develop/crates/types/src/dht_op.rs

export enum DHTOpType {
  StoreElement = "StoreElement",
  StoreEntry = "StoreEntry",
  RegisterAgentActivity = "RegisterAgentActivity",
  RegisterUpdatedContent = "RegisterUpdatedContent",
  RegisterUpdatedElement = "RegisterUpdatedElement",
  RegisterDeletedBy = "RegisterDeletedBy",
  RegisterDeletedEntryHeader = "RegisterDeletedEntryHeader",
  RegisterAddLink = "RegisterAddLink",
  RegisterRemoveLink = "RegisterRemoveLink",
}

export const DHT_SORT_PRIORITY = [
  DHTOpType.RegisterAgentActivity,
  DHTOpType.StoreEntry,
  DHTOpType.StoreElement,
  DHTOpType.RegisterUpdatedContent,
  DHTOpType.RegisterUpdatedElement,
  DHTOpType.RegisterDeletedEntryHeader,
  DHTOpType.RegisterDeletedBy,
  DHTOpType.RegisterAddLink,
  DHTOpType.RegisterRemoveLink,
];

export interface DHTOpContent<T, H extends Header> {
  type: T;
  header: SignedHeaderHashed<H>;
}

export type DHTOp =
  | (DHTOpContent<DHTOpType.StoreElement, Header> & {
      maybe_entry: Entry | undefined;
    })
  | (DHTOpContent<DHTOpType.StoreEntry, NewEntryHeader> & { entry: Entry })
  | DHTOpContent<DHTOpType.RegisterAgentActivity, Header>
  | DHTOpContent<DHTOpType.RegisterUpdatedContent, Update>
  | DHTOpContent<DHTOpType.RegisterUpdatedElement, Update>
  | DHTOpContent<DHTOpType.RegisterDeletedBy, Delete>
  | DHTOpContent<DHTOpType.RegisterDeletedEntryHeader, Delete>
  | DHTOpContent<DHTOpType.RegisterAddLink, CreateLink>
  | DHTOpContent<DHTOpType.RegisterRemoveLink, DeleteLink>;

export function elementToDHTOps(element: Element): DHTOp[] {
  const allDhtOps: DHTOp[] = [];

  // All hdk commands have these two DHT Ops

  allDhtOps.push({
    type: DHTOpType.RegisterAgentActivity,
    header: element.signed_header,
  });
  allDhtOps.push({
    type: DHTOpType.StoreElement,
    header: element.signed_header,
    maybe_entry: element.entry,
  });

  // Each header derives into different DHTOps

  if (element.signed_header.header.content.type == HeaderType.Update) {
    allDhtOps.push({
      type: DHTOpType.RegisterUpdatedContent,
      header: element.signed_header as SignedHeaderHashed<Update>,
    });
    allDhtOps.push({
      type: DHTOpType.RegisterUpdatedElement,
      header: element.signed_header as SignedHeaderHashed<Update>,
    });
    allDhtOps.push({
      type: DHTOpType.StoreEntry,
      header: element.signed_header as SignedHeaderHashed<Update>,
      entry: element.entry as Entry,
    });
  } else if (element.signed_header.header.content.type == HeaderType.Create) {
    allDhtOps.push({
      type: DHTOpType.StoreEntry,
      header: element.signed_header as SignedHeaderHashed<Create>,
      entry: element.entry as Entry,
    });
  } else if (element.signed_header.header.content.type == HeaderType.Delete) {
    allDhtOps.push({
      type: DHTOpType.RegisterDeletedBy,
      header: element.signed_header as SignedHeaderHashed<Delete>,
    });
    allDhtOps.push({
      type: DHTOpType.RegisterDeletedEntryHeader,
      header: element.signed_header as SignedHeaderHashed<Delete>,
    });
  } else if (
    element.signed_header.header.content.type == HeaderType.DeleteLink
  ) {
    allDhtOps.push({
      type: DHTOpType.RegisterRemoveLink,
      header: element.signed_header as SignedHeaderHashed<DeleteLink>,
    });
  } else if (
    element.signed_header.header.content.type == HeaderType.CreateLink
  ) {
    allDhtOps.push({
      type: DHTOpType.RegisterAddLink,
      header: element.signed_header as SignedHeaderHashed<CreateLink>,
    });
  }

  return allDhtOps;
}

export function sortDHTOps(dhtOps: DHTOp[]): DHTOp[] {
  const prio = (dhtOp: DHTOp) =>
    DHT_SORT_PRIORITY.findIndex((type) => type === dhtOp.type);
  return dhtOps.sort((dhtA: DHTOp, dhtB: DHTOp) => prio(dhtA) - prio(dhtB));
}

export function getEntry(dhtOp: DHTOp): Entry | undefined {
  if (dhtOp.type === DHTOpType.StoreEntry) return dhtOp.entry;
  else if (dhtOp.type === DHTOpType.StoreElement) return dhtOp.maybe_entry;
  return undefined;
}
