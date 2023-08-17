import * as OnchainDataType from "./OnchainDataType"
import * as MetadataData from "./MetadataData"

export { OnchainDataType }

/** Onchain Data Type describes the format of the onchain data */
export type OnchainDataTypeKind =
  | OnchainDataType.Bytes
  | OnchainDataType.Hex
  | OnchainDataType.Base64
export type OnchainDataTypeJSON =
  | OnchainDataType.BytesJSON
  | OnchainDataType.HexJSON
  | OnchainDataType.Base64JSON

export { MetadataData }

/** Metadata type describes how the actual token data is stored */
export type MetadataDataKind =
  | MetadataData.External
  | MetadataData.Reference
  | MetadataData.Onchain
export type MetadataDataJSON =
  | MetadataData.ExternalJSON
  | MetadataData.ReferenceJSON
  | MetadataData.OnchainJSON
