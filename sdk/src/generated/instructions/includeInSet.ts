import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface IncludeInSetAccounts {
  payer: PublicKey
  inclusionAuthority: PublicKey
  authoritiesGroup: PublicKey
  parentMetadata: PublicKey
  childMetadata: PublicKey
  inclusion: PublicKey
  systemProgram: PublicKey
}

export function includeInSet(
  accounts: IncludeInSetAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.inclusionAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.authoritiesGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.parentMetadata, isSigner: false, isWritable: false },
    { pubkey: accounts.childMetadata, isSigner: false, isWritable: false },
    { pubkey: accounts.inclusion, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([170, 187, 253, 162, 71, 219, 241, 251])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
