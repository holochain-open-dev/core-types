import { AgentPubKeyB64, DhtOpHashB64 } from './common';
import { Timestamp } from './timestamp';

export enum ValidationStatus {
  Valid,
  Rejected,
  Abandoned,
}

export interface ValidationReceipt {
  dht_op_hash: DhtOpHashB64;
  validation_status: ValidationStatus;
  validator: AgentPubKeyB64;
  when_integrated: Timestamp;
}
