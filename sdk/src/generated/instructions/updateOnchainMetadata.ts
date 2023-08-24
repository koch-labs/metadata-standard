import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateOnchainMetadataArgs {
  dataType: number
  dataAccount: PublicKey
}

export interface UpdateOnchainMetadataAccounts {
  updateAuthority: PublicKey
  authoritiesGroup: PublicKey
  metadata: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("dataType"),
  borsh.publicKey("dataAccount"),
])

export function updateOnchainMetadata(
  args: UpdateOnchainMetadataArgs,
  accounts: UpdateOnchainMetadataAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.updateAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.authoritiesGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([6, 20, 246, 216, 90, 189, 145, 97])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      dataType: args.dataType,
      dataAccount: args.dataAccount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}