import { Provider, Program } from "@coral-xyz/anchor";
import {
  ConfirmOptions,
  Keypair,
  PublicKey,
  Signer,
  Transaction,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import { NftStandard } from "./idl/nft_standard";
import IDL from "./idl/nft_standard.json";
import { NFT_STANDARD_PROGRAM_ID } from "./constants";
import { MetadataData } from "./metadataData";
import { getInclusionKey, getMetadataKey } from "./pdas";

type MintNftInput = {
  provider: Provider;
  authoritiesGroup: PublicKey;
  data: MetadataData;
  creator?: PublicKey;
  tokenProgram?: PublicKey;
  keypair?: Keypair;
  signers?: Signer[];
};
type IncludeInSetInput = {
  provider: Provider;
  authoritiesGroup: PublicKey;
  parentMint: PublicKey;
  childMint: PublicKey;
  inclusionAuthority?: PublicKey;
  signers?: Signer[];
  confirmOptions?: ConfirmOptions;
};
type MintSetElementInput = {
  provider: Provider;
  data: MetadataData;
  authoritiesGroup: PublicKey;
  parentMint: PublicKey;
  inclusionAuthority?: PublicKey;
  creator?: PublicKey;
  keypair?: Keypair;
  signers?: Signer[];
  confirmOptions?: ConfirmOptions;
};

type TransactionSender = {
  confirmOptions?: ConfirmOptions;
};

export const builders = {
  mintNft: ({
    provider,
    authoritiesGroup,
    data,
    creator,
    tokenProgram,
    keypair,
    signers,
  }: MintNftInput) => {
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

    return {
      mint: mintKeypair.publicKey,
      tokenAccount,
      metadata,
      authoritiesGroup,
      builder: program.methods
        .createMetadata(data)
        .accounts({
          creator: creator || provider.publicKey,
          authoritiesGroup,
          mint: mintKeypair.publicKey,
          tokenAccount,
          metadata,
          tokenProgram: tokenProgram || TOKEN_2022_PROGRAM_ID,
        })
        .signers([...(signers || []), mintKeypair]),
    };
  },
  includeInSet: ({
    provider,
    authoritiesGroup,
    parentMint,
    childMint,
    inclusionAuthority,
    signers,
  }: IncludeInSetInput) => {
    const program = new Program<NftStandard>(
      IDL as any,
      NFT_STANDARD_PROGRAM_ID,
      provider
    );
    const inclusion = getInclusionKey(parentMint, childMint);

    return {
      inclusion,
      builder: program.methods
        .includeInSet()
        .accounts({
          inclusionAuthority: inclusionAuthority || provider.publicKey,
          parentMetadata: getMetadataKey(parentMint),
          authoritiesGroup,
          childMetadata: getMetadataKey(childMint),
          inclusion,
        })
        .signers([...(signers || [])]),
    };
  },
};

export const mintNft = async ({
  confirmOptions,
  ...inputs
}: MintNftInput & TransactionSender) => {
  const { builder, mint, tokenAccount, metadata, authoritiesGroup } =
    builders.mintNft(inputs);

  await builder.rpc(confirmOptions);

  return {
    mint,
    tokenAccount,
    metadata,
    authoritiesGroup,
  };
};

export const includeInSet = async ({
  confirmOptions,
  ...inputs
}: IncludeInSetInput & TransactionSender) => {
  const { builder, inclusion } = builders.includeInSet(inputs);
  await builder.rpc(confirmOptions);

  return {
    inclusion,
  };
};

export const mintSetElement = async ({
  provider,
  data,
  parentMint,
  authoritiesGroup,
  inclusionAuthority,
  creator = inclusionAuthority,
  keypair,
  signers,
  confirmOptions,
}: MintSetElementInput & TransactionSender) => {
  const kp = keypair || Keypair.generate();
  const {
    builder: mintBuilder,
    mint,
    tokenAccount,
    metadata,
  } = builders.mintNft({
    provider,
    authoritiesGroup,
    data,
    creator,
    keypair: kp,
  });
  const { builder, inclusion } = builders.includeInSet({
    provider,
    childMint: kp.publicKey,
    authoritiesGroup,
    parentMint,
    inclusionAuthority,
  });
  await mintBuilder
    .signers(signers || [])
    .postInstructions([await builder.instruction()])
    .rpc(confirmOptions);

  return {
    mint,
    tokenAccount,
    metadata,
    inclusion,
  };
};
