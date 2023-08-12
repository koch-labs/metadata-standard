import { PublicKey } from "@solana/web3.js";

import {
  AUTHORITIES_SEED,
  METADATA_SEED,
  INCLUSION_SEED,
  SUPERSET_SEED,
  NFT_STANDARD_PROGRAM_ID,
} from "./constants";

// Metadata Standard PDAs
export const getAuthoritiesGroupKey = (id: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(AUTHORITIES_SEED), id.toBuffer()],
    NFT_STANDARD_PROGRAM_ID
  )[0];
};
export const getMetadataKey = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA_SEED), mint.toBuffer()],
    NFT_STANDARD_PROGRAM_ID
  )[0];
};
export const getInclusionKey = (parentMint: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(INCLUSION_SEED),
      getMetadataKey(parentMint).toBuffer(),
      getMetadataKey(mint).toBuffer(),
    ],
    NFT_STANDARD_PROGRAM_ID
  )[0];
};
export const getSupersetInclusionKey = (
  parentMint: PublicKey,
  mint: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SUPERSET_SEED),
      getMetadataKey(parentMint).toBuffer(),
      getMetadataKey(mint).toBuffer(),
    ],
    NFT_STANDARD_PROGRAM_ID
  )[0];
};

export const getAuthoritiesGroupBump = (id: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(AUTHORITIES_SEED), id.toBuffer()],
    NFT_STANDARD_PROGRAM_ID
  )[1];
};
export const getMetadataBump = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA_SEED), mint.toBuffer()],
    NFT_STANDARD_PROGRAM_ID
  )[1];
};
export const getInclusionBump = (parentMint: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(INCLUSION_SEED),
      getMetadataKey(parentMint).toBuffer(),
      getMetadataKey(mint).toBuffer(),
    ],
    NFT_STANDARD_PROGRAM_ID
  )[1];
};
