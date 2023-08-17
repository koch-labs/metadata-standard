import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ExcludeFromSupersetAccounts {
  holder: PublicKey
  parentMetadata: PublicKey
  childMetadata: PublicKey
  inclusion: PublicKey
  mint: PublicKey
  tokenAccount: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
}

export function excludeFromSuperset(
  accounts: ExcludeFromSupersetAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.holder, isSigner: false, isWritable: true },
    { pubkey: accounts.parentMetadata, isSigner: false, isWritable: false },
    { pubkey: accounts.childMetadata, isSigner: false, isWritable: false },
    { pubkey: accounts.inclusion, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([30, 160, 217, 124, 157, 135, 193, 183])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
