import { Provider, Program } from "@coral-xyz/anchor";
import {
  ConfirmOptions,
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializePermanentDelegateInstruction,
  getAssociatedTokenAddressSync,
  getMintLen,
} from "@solana/spl-token";

import { NftStandard } from "./idl/nft_standard";
import IDL from "./idl/nft_standard.json";
import { NFT_STANDARD_PROGRAM_ID } from "./constants";
import { MetadataData } from "./metadataData";
import {
  getInclusionKey,
  getMetadataKey,
  getSupersetInclusionKey,
} from "./pdas";
import { getPathBumpsFromMints } from "./superset";

export type MintNftInput = {
  provider: Provider;
  authoritiesGroup: PublicKey;
  data: MetadataData;
  creator?: PublicKey;
  keypair?: Keypair;
  permanentDelegate?: PublicKey;
  tokenProgram?: PublicKey;
  signers?: Signer[];
};
export type IncludeInSetInput = {
  provider: Provider;
  authoritiesGroup: PublicKey;
  parentMint: PublicKey;
  childMint: PublicKey;
  inclusionAuthority?: PublicKey;
  signers?: Signer[];
};
export type IncludeInSupersetInput = {
  provider: Provider;
  mints: PublicKey[];
};

export const builders = {
  mintNft: ({
    provider,
    authoritiesGroup,
    data,
    creator,
    keypair,
    permanentDelegate,
    tokenProgram,
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
  excludeInSet: ({
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
    const parentMetadata = getMetadataKey(parentMint);
    const childMetadata = getMetadataKey(childMint);
    const inclusion = getInclusionKey(parentMint, childMint);

    return {
      inclusion,
      builder: program.methods
        .excludeFromSet()
        .accounts({
          inclusionAuthority,
          authoritiesGroup,
          parentMetadata,
          childMetadata,
          inclusion,
        })
        .signers([...(signers || [])]),
    };
  },
  includeInSuperset: ({ provider, mints }: IncludeInSupersetInput) => {
    const program = new Program<NftStandard>(
      IDL as any,
      NFT_STANDARD_PROGRAM_ID,
      provider
    );
    const pathBumps = getPathBumpsFromMints(mints);
    const accounts = [
      {
        pubkey: mints[mints.length - 1],
        isSigner: false,
        isWritable: false,
      },
    ];
    for (let i = mints.length - 1; i > 0; i--) {
      accounts.unshift(
        {
          pubkey: getInclusionKey(mints[i - 1], mints[i]),
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: getMetadataKey(mints[i - 1]),
          isSigner: false,
          isWritable: false,
        }
      );
    }
    const parentMetadata = getMetadataKey(mints[0]);
    const childMetadata = getMetadataKey(mints[mints.length - 1]);
    const inclusion = getSupersetInclusionKey(
      mints[0],
      mints[mints.length - 1]
    );

    return {
      inclusion,
      builder: program.methods
        .includeInSuperset(pathBumps)
        .accounts({
          parentMetadata,
          childMetadata,
          inclusion,
        })
        .remainingAccounts(accounts),
    };
  },
};
