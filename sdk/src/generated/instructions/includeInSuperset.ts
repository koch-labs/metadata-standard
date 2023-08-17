import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface IncludeInSupersetArgs {
  bumps: Uint8Array
}

export interface IncludeInSupersetAccounts {
  payer: PublicKey
  parentMetadata: PublicKey
  childMetadata: PublicKey
  inclusion: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.vecU8("bumps")])

/**
 * Verification path is passed as remaining accounts in the form `[Metadata, Inclusion, Metadata, Inclusion, ...]`
 * Only pass bumps of inclusions
 */
export function includeInSuperset(
  args: IncludeInSupersetArgs,
  accounts: IncludeInSupersetAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.parentMetadata, isSigner: false, isWritable: false },
    { pubkey: accounts.childMetadata, isSigner: false, isWritable: false },
    { pubkey: accounts.inclusion, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([177, 172, 97, 37, 232, 146, 249, 22])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bumps: Buffer.from(
        args.bumps.buffer,
        args.bumps.byteOffset,
        args.bumps.length
      ),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
