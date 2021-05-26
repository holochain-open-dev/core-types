import { AgentPubKeyB64 } from "./common";

export type CapSecret = string;

export interface CapClaim {
  tag: string;
  grantor: AgentPubKeyB64;
  secret: CapSecret;
}

export interface ZomeCallCapGrant {
  tag: string;
  access: CapAccess;
  functions: Array<{ zome: string; fn_name: string }>;
}

export type CapAccess =
  | "Unrestricted"
  | {
      Transferable: { secret: CapSecret };
    }
  | { Assigned: { secret: CapSecret; assignees: AgentPubKeyB64[] } };

export type CapGrant =
  | {
      ChainAuthor: AgentPubKeyB64;
    }
  | {
      RemoteAgent: ZomeCallCapGrant;
    };
