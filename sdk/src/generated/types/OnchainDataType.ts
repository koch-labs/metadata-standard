import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface BytesJSON {
  kind: "Bytes"
}

export class Bytes {
  static readonly discriminator = 0
  static readonly kind = "Bytes"
  readonly discriminator = 0
  readonly kind = "Bytes"

  toJSON(): BytesJSON {
    return {
      kind: "Bytes",
    }
  }

  toEncodable() {
    return {
      Bytes: {},
    }
  }
}

export interface HexJSON {
  kind: "Hex"
}

export class Hex {
  static readonly discriminator = 1
  static readonly kind = "Hex"
  readonly discriminator = 1
  readonly kind = "Hex"

  toJSON(): HexJSON {
    return {
      kind: "Hex",
    }
  }

  toEncodable() {
    return {
      Hex: {},
    }
  }
}

export interface Base64JSON {
  kind: "Base64"
}

export class Base64 {
  static readonly discriminator = 2
  static readonly kind = "Base64"
  readonly discriminator = 2
  readonly kind = "Base64"

  toJSON(): Base64JSON {
    return {
      kind: "Base64",
    }
  }

  toEncodable() {
    return {
      Base64: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.OnchainDataTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Bytes" in obj) {
    return new Bytes()
  }
  if ("Hex" in obj) {
    return new Hex()
  }
  if ("Base64" in obj) {
    return new Base64()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.OnchainDataTypeJSON
): types.OnchainDataTypeKind {
  switch (obj.kind) {
    case "Bytes": {
      return new Bytes()
    }
    case "Hex": {
      return new Hex()
    }
    case "Base64": {
      return new Base64()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Bytes"),
    borsh.struct([], "Hex"),
    borsh.struct([], "Base64"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
