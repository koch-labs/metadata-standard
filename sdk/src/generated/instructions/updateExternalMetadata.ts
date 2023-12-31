import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateExternalMetadataArgs {
  name: string
  contentHash: Array<number>
  uri: string
}

export interface UpdateExternalMetadataAccounts {
  metadataAuthority: PublicKey
  authoritiesGroup: PublicKey
  metadata: PublicKey
}

export const layout = borsh.struct([
  borsh.str("name"),
  borsh.array(borsh.u8(), 32, "contentHash"),
  borsh.str("uri"),
])

export function updateExternalMetadata(
  args: UpdateExternalMetadataArgs,
  accounts: UpdateExternalMetadataAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.metadataAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.authoritiesGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([35, 55, 63, 31, 127, 149, 243, 5])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      name: args.name,
      contentHash: args.contentHash,
      uri: args.uri,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
