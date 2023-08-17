import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MetadataFields {
  mint: PublicKey
  authoritiesGroup: PublicKey
  setVersionCounter: number
  data: types.MetadataDataKind
}

export interface MetadataJSON {
  mint: string
  authoritiesGroup: string
  setVersionCounter: number
  data: types.MetadataDataJSON
}

export class Metadata {
  readonly mint: PublicKey
  readonly authoritiesGroup: PublicKey
  readonly setVersionCounter: number
  readonly data: types.MetadataDataKind

  static readonly discriminator = Buffer.from([
    72, 11, 121, 26, 111, 181, 85, 93,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("mint"),
    borsh.publicKey("authoritiesGroup"),
    borsh.u32("setVersionCounter"),
    types.MetadataData.layout("data"),
  ])

  constructor(fields: MetadataFields) {
    this.mint = fields.mint
    this.authoritiesGroup = fields.authoritiesGroup
    this.setVersionCounter = fields.setVersionCounter
    this.data = fields.data
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Metadata | null> {
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
  ): Promise<Array<Metadata | null>> {
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

  static decode(data: Buffer): Metadata {
    if (!data.slice(0, 8).equals(Metadata.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Metadata.layout.decode(data.slice(8))

    return new Metadata({
      mint: dec.mint,
      authoritiesGroup: dec.authoritiesGroup,
      setVersionCounter: dec.setVersionCounter,
      data: types.MetadataData.fromDecoded(dec.data),
    })
  }

  toJSON(): MetadataJSON {
    return {
      mint: this.mint.toString(),
      authoritiesGroup: this.authoritiesGroup.toString(),
      setVersionCounter: this.setVersionCounter,
      data: this.data.toJSON(),
    }
  }

  static fromJSON(obj: MetadataJSON): Metadata {
    return new Metadata({
      mint: new PublicKey(obj.mint),
      authoritiesGroup: new PublicKey(obj.authoritiesGroup),
      setVersionCounter: obj.setVersionCounter,
      data: types.MetadataData.fromJSON(obj.data),
    })
  }
}
