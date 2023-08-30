import { MetadataStandard } from "./generated/metadataStandard";
import { IdlTypes } from "@coral-xyz/anchor";

export type MetadataData = IdlTypes<MetadataStandard>["MetadataData"];

export const createExternalMetadataData = (uri: string): MetadataData => {
  return {
    external: { uri },
  };
};
