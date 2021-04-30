import { AgentPubKey, Hash } from './common';
import { Timestamp } from './timestamp';

export enum ValidationStatus {
  Valid,
  Rejected,
  Abandoned,
}

export interface ValidationReceipt {
  dht_op_hash: Hash;
  validation_status: ValidationStatus;
  validator: AgentPubKey;
  when_integrated: Timestamp;
}
