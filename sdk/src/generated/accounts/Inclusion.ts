import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InclusionFields {
  inclusionSlot: BN
}

export interface InclusionJSON {
  inclusionSlot: string
}

export class Inclusion {
  readonly inclusionSlot: BN

  static readonly discriminator = Buffer.from([
    99, 28, 31, 144, 117, 46, 199, 39,
  ])

  static readonly layout = borsh.struct([borsh.u64("inclusionSlot")])

  constructor(fields: InclusionFields) {
    this.inclusionSlot = fields.inclusionSlot
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Inclusion | null> {
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
  ): Promise<Array<Inclusion | null>> {
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

  static decode(data: Buffer): Inclusion {
    if (!data.slice(0, 8).equals(Inclusion.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Inclusion.layout.decode(data.slice(8))

    return new Inclusion({
      inclusionSlot: dec.inclusionSlot,
    })
  }

  toJSON(): InclusionJSON {
    return {
      inclusionSlot: this.inclusionSlot.toString(),
    }
  }

  static fromJSON(obj: InclusionJSON): Inclusion {
    return new Inclusion({
      inclusionSlot: new BN(obj.inclusionSlot),
    })
  }
}
