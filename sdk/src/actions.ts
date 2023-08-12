import { Provider, Program } from "@coral-xyz/anchor";
import { ConfirmOptions, Keypair, PublicKey, Signer } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import { NftStandard } from "./idl/nft_standard";
import IDL from "./idl/nft_standard.json";
import { NFT_STANDARD_PROGRAM_ID } from "./constants";
import { MetadataData } from "./metadataData";
import { getInclusionKey, getMetadataKey } from "./pdas";

export const mintNft = async ({
  provider,
  authoritiesGroup,
  data,
  creator,
  tokenProgram,
  keypair,
  signers,
  confirmOptions,
}: {
  provider: Provider;
  authoritiesGroup: PublicKey;
  data: MetadataData;
  creator?: PublicKey;
  tokenProgram?: PublicKey;
  keypair?: Keypair;
  signers?: Signer[];
  confirmOptions?: ConfirmOptions;
}) => {
  const program = new Program<NftStandard>(
    IDL as any,
    NFT_STANDARD_PROGRAM_ID,
    provider
  );
  const mintKeypair = keypair || Keypair.generate();
  const metadata = getMetadataKey(mintKeypair.publicKey);
  const tokenAccount = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    creator || provider.publicKey,
    true,
    tokenProgram || TOKEN_2022_PROGRAM_ID
  );

  await program.methods
    .createMetadata(data)
    .accounts({
      creator: creator || provider.publicKey,
      authoritiesGroup,
      mint: mintKeypair.publicKey,
      tokenAccount,
      metadata,
      tokenProgram: tokenProgram || TOKEN_2022_PROGRAM_ID,
    })
    .signers([...(signers || []), mintKeypair])
    .rpc(confirmOptions);

  return {
    mint: mintKeypair.publicKey,
    tokenAccount,
    metadata,
    authoritiesGroup,
  };
};

export const includeInSet = async ({
  provider,
  parentMint,
  authoritiesGroup,
  childMint,
  inclusionAuthority,
}: {
  provider: Provider;
  authoritiesGroup: PublicKey;
  parentMint: PublicKey;
  childMint: PublicKey;
  inclusionAuthority?: PublicKey;
}) => {
  const program = new Program<NftStandard>(
    IDL as any,
    NFT_STANDARD_PROGRAM_ID,
    provider
  );
  const inclusion = getInclusionKey(parentMint, childMint);

  return {
    inclusion,
    ix: await program.methods
      .includeInSet()
      .accounts({
        inclusionAuthority: inclusionAuthority || provider.publicKey,
        parentMetadata: getMetadataKey(parentMint),
        authoritiesGroup,
        childMetadata: getMetadataKey(parentMint),
        inclusion,
      })
      .instruction(),
  };
};
