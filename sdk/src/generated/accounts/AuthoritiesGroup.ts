import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AuthoritiesGroupFields {
  id: PublicKey
  /** The account that can update the authorities group */
  updateAuthority: PublicKey
  /** The account that can update metadata */
  metadataAuthority: PublicKey
  /** The account that can include other tokens in the set */
  inclusionAuthority: PublicKey
}

export interface AuthoritiesGroupJSON {
  id: string
  /** The account that can update the authorities group */
  updateAuthority: string
  /** The account that can update metadata */
  metadataAuthority: string
  /** The account that can include other tokens in the set */
  inclusionAuthority: string
}

export class AuthoritiesGroup {
  readonly id: PublicKey
  /** The account that can update the authorities group */
  readonly updateAuthority: PublicKey
  /** The account that can update metadata */
  readonly metadataAuthority: PublicKey
  /** The account that can include other tokens in the set */
  readonly inclusionAuthority: PublicKey

  static readonly discriminator = Buffer.from([
    218, 99, 1, 175, 110, 140, 190, 183,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("id"),
    borsh.publicKey("updateAuthority"),
    borsh.publicKey("metadataAuthority"),
    borsh.publicKey("inclusionAuthority"),
  ])

  constructor(fields: AuthoritiesGroupFields) {
    this.id = fields.id
    this.updateAuthority = fields.updateAuthority
    this.metadataAuthority = fields.metadataAuthority
    this.inclusionAuthority = fields.inclusionAuthority
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<AuthoritiesGroup | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<AuthoritiesGroup | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): AuthoritiesGroup {
    if (!data.slice(0, 8).equals(AuthoritiesGroup.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = AuthoritiesGroup.layout.decode(data.slice(8))

    return new AuthoritiesGroup({
      id: dec.id,
      updateAuthority: dec.updateAuthority,
      metadataAuthority: dec.metadataAuthority,
      inclusionAuthority: dec.inclusionAuthority,
    })
  }

  toJSON(): AuthoritiesGroupJSON {
    return {
      id: this.id.toString(),
      updateAuthority: this.updateAuthority.toString(),
      metadataAuthority: this.metadataAuthority.toString(),
      inclusionAuthority: this.inclusionAuthority.toString(),
    }
  }

  static fromJSON(obj: AuthoritiesGroupJSON): AuthoritiesGroup {
    return new AuthoritiesGroup({
      id: new PublicKey(obj.id),
      updateAuthority: new PublicKey(obj.updateAuthority),
      metadataAuthority: new PublicKey(obj.metadataAuthority),
      inclusionAuthority: new PublicKey(obj.inclusionAuthority),
    })
  }
}
