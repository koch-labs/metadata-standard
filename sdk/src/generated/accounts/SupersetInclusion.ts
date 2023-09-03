import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SupersetInclusionFields {
  inclusionSlot: BN
}

export interface SupersetInclusionJSON {
  inclusionSlot: string
}

export class SupersetInclusion {
  readonly inclusionSlot: BN

  static readonly discriminator = Buffer.from([
    184, 9, 146, 162, 166, 124, 148, 187,
  ])

  static readonly layout = borsh.struct([borsh.u64("inclusionSlot")])

  constructor(fields: SupersetInclusionFields) {
    this.inclusionSlot = fields.inclusionSlot
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<SupersetInclusion | null> {
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
  ): Promise<Array<SupersetInclusion | null>> {
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

  static decode(data: Buffer): SupersetInclusion {
    if (!data.slice(0, 8).equals(SupersetInclusion.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = SupersetInclusion.layout.decode(data.slice(8))

    return new SupersetInclusion({
      inclusionSlot: dec.inclusionSlot,
    })
  }

  toJSON(): SupersetInclusionJSON {
    return {
      inclusionSlot: this.inclusionSlot.toString(),
    }
  }

  static fromJSON(obj: SupersetInclusionJSON): SupersetInclusion {
    return new SupersetInclusion({
      inclusionSlot: new BN(obj.inclusionSlot),
    })
  }
}
