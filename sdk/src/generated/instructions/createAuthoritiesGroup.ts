import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateAuthoritiesGroupArgs {
  id: PublicKey
  updateAuthority: PublicKey
  metadataAuthority: PublicKey
  inclusionAuthority: PublicKey
}

export interface CreateAuthoritiesGroupAccounts {
  payer: PublicKey
  authoritiesGroup: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.publicKey("id"),
  borsh.publicKey("updateAuthority"),
  borsh.publicKey("metadataAuthority"),
  borsh.publicKey("inclusionAuthority"),
])

export function createAuthoritiesGroup(
  args: CreateAuthoritiesGroupArgs,
  accounts: CreateAuthoritiesGroupAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.authoritiesGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([84, 118, 108, 2, 227, 160, 123, 68])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      id: args.id,
      updateAuthority: args.updateAuthority,
      metadataAuthority: args.metadataAuthority,
      inclusionAuthority: args.inclusionAuthority,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
