import { Program, Provider } from "@coral-xyz/anchor";
import { MetadataStandard } from "./generated/metadataStandard";
import IDL from "./generated/idl.json";
import { METADATA_STANDARD_PROGRAM_ID } from "./constants";
import { PublicKey } from "@solana/web3.js";
import {
  getAuthoritiesGroupKey,
  getInclusionKey,
  getMetadataKey,
  getSupersetInclusionKey,
} from "./pdas";

const getProgram = (provider: Provider) => {
  return new Program<MetadataStandard>(
    IDL as any,
    METADATA_STANDARD_PROGRAM_ID,
    provider
  );
};

export const fetchAuthoritiesGroupById = async (
  provider: Provider,
  id: PublicKey
) => {
  return await getProgram(provider).account.authoritiesGroup.fetch(
    getAuthoritiesGroupKey(id)
  );
};

export const fetchAuthoritiesGroupByKey = async (
  provider: Provider,
  key: PublicKey
) => {
  return await getProgram(provider).account.authoritiesGroup.fetch(key);
};

export const fetchMetadata = async (provider: Provider, mint: PublicKey) => {
  return await getProgram(provider).account.metadata.fetch(
    getMetadataKey(mint)
  );
};

export const fetchInclusion = async (
  provider: Provider,
  parentMint: PublicKey,
  childMint: PublicKey
) => {
  return await getProgram(provider).account.inclusion.fetch(
    getInclusionKey(parentMint, childMint)
  );
};

export const fetchSupersetInclusion = async (
  provider: Provider,
  parentMint: PublicKey,
  childMint: PublicKey
) => {
  return await getProgram(provider).account.inclusion.fetch(
    getSupersetInclusionKey(parentMint, childMint)
  );
};
