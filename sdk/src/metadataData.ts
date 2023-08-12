import { NftStandard } from "@/idl/nft_standard";
import { IdlTypes } from "@coral-xyz/anchor";

export type MetadataData = IdlTypes<NftStandard>["MetadataData"];

export const createExternalMetadataData = (uri: string): MetadataData => {
  return {
    external: { uri },
  };
};
