import { Keypair, PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import {
  getAuthoritiesGroupKey,
  getSupersetInclusionKey,
  getInclusionKey,
  getMetadataKey,
} from "../sdk/src";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  MetadataData,
  createExternalMetadataData,
} from "../sdk/src/metadataData";
import { getPathBumpsFromMints } from "../sdk/src/superset";

export interface TestValues {
  tokenProgram: PublicKey;
  admin: Keypair;
  transferAuthority: Keypair;
  updateAuthority: Keypair;
  metadataAuthority: Keypair;
  inclusionAuthority: Keypair;
  authoritiesGroupId: PublicKey;
  authoritiesGroupKey: PublicKey;
  parentAuthoritiesGroupId: PublicKey;
  parentAuthoritiesGroupKey: PublicKey;
  mintKeypair: Keypair;
  mintKeypair2022: Keypair;
  parentMintKeypair2022: Keypair;
  metadataUri: string;
  metadataName: string;
  metadataHash: number[];
  metadataData: MetadataData;
  metadataKey: PublicKey;
  metadata2022Key: PublicKey;
  parentMetadata2022Key: PublicKey;
  holder: Keypair;
  holderMintAccount: PublicKey;
  holderMintAccount2022: PublicKey;
  holderParentMintAccount2022: PublicKey;
  inclusionKey: PublicKey;
  supersetInclusionKey: PublicKey;
  pathBumps: Buffer;
}

export const createValues = (): TestValues => {
  const tokenProgram = TOKEN_2022_PROGRAM_ID;
  const admin = Keypair.generate();
  const transferAuthority = Keypair.generate();
  const metadataAuthority = Keypair.generate();
  const updateAuthority = Keypair.generate();
  const inclusionAuthority = Keypair.generate();
  const authoritiesGroupId = Keypair.generate().publicKey;
  const authoritiesGroupKey = getAuthoritiesGroupKey(authoritiesGroupId);
  const parentAuthoritiesGroupId = Keypair.generate().publicKey;
  const parentAuthoritiesGroupKey = getAuthoritiesGroupKey(
    parentAuthoritiesGroupId
  );
  const mintKeypair = Keypair.generate();
  const mintKeypair2022 = Keypair.generate();
  const parentMintKeypair2022 = Keypair.generate();
  const metadataName = "some name";
  const metadataUri = "some uri";
  const metadataData = createExternalMetadataData(metadataUri);
  const metadataHash = [
    ...utils.bytes.utf8
      .encode("stringification of the actual metadata")
      .values(),
  ];
  const metadataKey = getMetadataKey(mintKeypair.publicKey);
  const metadata2022Key = getMetadataKey(mintKeypair2022.publicKey);
  const parentMetadata2022Key = getMetadataKey(parentMintKeypair2022.publicKey);
  const holder = Keypair.generate();
  const holderMintAccount = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    holder.publicKey,
    true,
    TOKEN_PROGRAM_ID
  );
  const holderMintAccount2022 = getAssociatedTokenAddressSync(
    mintKeypair2022.publicKey,
    holder.publicKey,
    true,
    tokenProgram
  );
  const holderParentMintAccount2022 = getAssociatedTokenAddressSync(
    parentMintKeypair2022.publicKey,
    holder.publicKey,
    true,
    tokenProgram
  );
  const inclusionKey = getInclusionKey(
    parentMintKeypair2022.publicKey,
    mintKeypair2022.publicKey
  );
  const supersetInclusionKey = getSupersetInclusionKey(
    parentMintKeypair2022.publicKey,
    mintKeypair2022.publicKey
  );
  const pathBumps = getPathBumpsFromMints([
    parentMintKeypair2022.publicKey,
    mintKeypair2022.publicKey,
  ]);
  return {
    admin,
    updateAuthority,
    metadataAuthority,
    transferAuthority,
    inclusionAuthority,
    authoritiesGroupId,
    authoritiesGroupKey,
    parentAuthoritiesGroupId,
    parentAuthoritiesGroupKey,
    mintKeypair,
    mintKeypair2022,
    parentMintKeypair2022,
    metadataUri,
    metadataName,
    metadataHash,
    metadataData,
    metadataKey,
    metadata2022Key,
    parentMetadata2022Key,
    holder,
    holderMintAccount,
    holderMintAccount2022,
    holderParentMintAccount2022,
    inclusionKey,
    supersetInclusionKey,
    pathBumps,
    tokenProgram,
  };
};
