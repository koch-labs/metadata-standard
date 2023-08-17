import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export type ExternalFields = {
  uri: string
}
export type ExternalValue = {
  uri: string
}

export interface ExternalJSON {
  kind: "External"
  value: {
    uri: string
  }
}

export class External {
  static readonly discriminator = 0
  static readonly kind = "External"
  readonly discriminator = 0
  readonly kind = "External"
  readonly value: ExternalValue

  constructor(value: ExternalFields) {
    this.value = {
      uri: value.uri,
    }
  }

  toJSON(): ExternalJSON {
    return {
      kind: "External",
      value: {
        uri: this.value.uri,
      },
    }
  }

  toEncodable() {
    return {
      External: {
        uri: this.value.uri,
      },
    }
  }
}

export type ReferenceFields = {
  metadataAccount: PublicKey
}
export type ReferenceValue = {
  metadataAccount: PublicKey
}

export interface ReferenceJSON {
  kind: "Reference"
  value: {
    metadataAccount: string
  }
}

export class Reference {
  static readonly discriminator = 1
  static readonly kind = "Reference"
  readonly discriminator = 1
  readonly kind = "Reference"
  readonly value: ReferenceValue

  constructor(value: ReferenceFields) {
    this.value = {
      metadataAccount: value.metadataAccount,
    }
  }

  toJSON(): ReferenceJSON {
    return {
      kind: "Reference",
      value: {
        metadataAccount: this.value.metadataAccount.toString(),
      },
    }
  }

  toEncodable() {
    return {
      Reference: {
        metadata_account: this.value.metadataAccount,
      },
    }
  }
}

export type OnchainFields = {
  dataType: types.OnchainDataTypeKind
  dataAccount: PublicKey
}
export type OnchainValue = {
  dataType: types.OnchainDataTypeKind
  dataAccount: PublicKey
}

export interface OnchainJSON {
  kind: "Onchain"
  value: {
    dataType: types.OnchainDataTypeJSON
    dataAccount: string
  }
}

export class Onchain {
  static readonly discriminator = 2
  static readonly kind = "Onchain"
  readonly discriminator = 2
  readonly kind = "Onchain"
  readonly value: OnchainValue

  constructor(value: OnchainFields) {
    this.value = {
      dataType: value.dataType,
      dataAccount: value.dataAccount,
    }
  }

  toJSON(): OnchainJSON {
    return {
      kind: "Onchain",
      value: {
        dataType: this.value.dataType.toJSON(),
        dataAccount: this.value.dataAccount.toString(),
      },
    }
  }

  toEncodable() {
    return {
      Onchain: {
        data_type: this.value.dataType.toEncodable(),
        data_account: this.value.dataAccount,
      },
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.MetadataDataKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("External" in obj) {
    const val = obj["External"]
    return new External({
      uri: val["uri"],
    })
  }
  if ("Reference" in obj) {
    const val = obj["Reference"]
    return new Reference({
      metadataAccount: val["metadata_account"],
    })
  }
  if ("Onchain" in obj) {
    const val = obj["Onchain"]
    return new Onchain({
      dataType: types.OnchainDataType.fromDecoded(val["data_type"]),
      dataAccount: val["data_account"],
    })
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.MetadataDataJSON): types.MetadataDataKind {
  switch (obj.kind) {
    case "External": {
      return new External({
        uri: obj.value.uri,
      })
    }
    case "Reference": {
      return new Reference({
        metadataAccount: new PublicKey(obj.value.metadataAccount),
      })
    }
    case "Onchain": {
      return new Onchain({
        dataType: types.OnchainDataType.fromJSON(obj.value.dataType),
        dataAccount: new PublicKey(obj.value.dataAccount),
      })
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([borsh.str("uri")], "External"),
    borsh.struct([borsh.publicKey("metadata_account")], "Reference"),
    borsh.struct(
      [
        types.OnchainDataType.layout("data_type"),
        borsh.publicKey("data_account"),
      ],
      "Onchain"
    ),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
