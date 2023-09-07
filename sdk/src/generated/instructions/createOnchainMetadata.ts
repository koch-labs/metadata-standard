import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateOnchainMetadataArgs {
  name: string
  contentHash: Array<number>
  dataType: number
  dataAccount: PublicKey
}

export interface CreateOnchainMetadataAccounts {
  payer: PublicKey
  mintAuthority: PublicKey
  authoritiesGroup: PublicKey
  mint: PublicKey
  metadata: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.str("name"),
  borsh.array(borsh.u8(), 32, "contentHash"),
  borsh.u8("dataType"),
  borsh.publicKey("dataAccount"),
])

export function createOnchainMetadata(
  args: CreateOnchainMetadataArgs,
  accounts: CreateOnchainMetadataAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.mintAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.authoritiesGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([44, 103, 114, 179, 98, 149, 110, 200])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      name: args.name,
      contentHash: args.contentHash,
      dataType: args.dataType,
      dataAccount: args.dataAccount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
