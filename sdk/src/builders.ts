import { Provider, Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import { NftStandard } from "./generated/nftStandard";
import IDL from "./generated/idl.json";
import { NFT_STANDARD_PROGRAM_ID } from "./constants";
import { MetadataData } from "./metadataData";
import {
  getAuthoritiesGroupKey,
  getInclusionKey,
  getMetadataKey,
  getSupersetInclusionKey,
} from "./pdas";
import { getPathBumpsFromMints } from "./superset";

export type CreateAuthoritiesGroupInput = {
  provider: Provider;
  id?: PublicKey;
  updateAuthority: PublicKey;
  metadataAuthority: PublicKey;
  inclusionAuthority: PublicKey;
};
export type MintNftInput = {
  provider: Provider;
  authoritiesGroup: PublicKey;
  data: MetadataData;
  mint: PublicKey;
  tokenProgram: PublicKey;
};
export type IncludeInSetInput = {
  provider: Provider;
  authoritiesGroup: PublicKey;
  parentMint: PublicKey;
  childMint: PublicKey;
  inclusionAuthority: PublicKey;
};
export type IncludeInSupersetInput = {
  provider: Provider;
  mints: PublicKey[];
};
export type ExcludeFromSupersetInput = {
  provider: Provider;
  parentMint: PublicKey;
  childMint: PublicKey;
  holder: PublicKey;
  tokenProgram?: PublicKey;
};

export const builders = {
  createAuthoritiesGroup: ({
    provider,
    id = Keypair.generate().publicKey,
    updateAuthority,
    metadataAuthority,
    inclusionAuthority,
  }: CreateAuthoritiesGroupInput) => {
    const program = new Program<NftStandard>(
      IDL as any,
      NFT_STANDARD_PROGRAM_ID,
      provider
    );
    const authoritiesGroup = getAuthoritiesGroupKey(id);

    return {
      authoritiesGroup,
      builder: program.methods
        .createAuthoritiesGroup(
          id,
          updateAuthority,
          metadataAuthority,
          inclusionAuthority
        )
        .accounts({
          authoritiesGroup,
        }),
    };
  },
  createMetadata: ({
    provider,
    authoritiesGroup,
    data,
    mint,
    tokenProgram = TOKEN_2022_PROGRAM_ID,
  }: MintNftInput) => {
    const program = new Program<NftStandard>(
      IDL as any,
      NFT_STANDARD_PROGRAM_ID,
      provider
    );
    const metadata = getMetadataKey(mint);

    let builder;
    if (data.external) {
      builder = program.methods
        .createExternalMetadata(data.external.uri)
        .accounts({
          authoritiesGroup,
          mint,
          metadata,
          tokenProgram: tokenProgram || TOKEN_2022_PROGRAM_ID,
        });
    } else if (data.reference) {
      builder = program.methods
        .createReferenceMetadata(data.reference.metadataAccount)
        .accounts({
          authoritiesGroup,
          mint,
          metadata,
          tokenProgram: tokenProgram || TOKEN_2022_PROGRAM_ID,
        });
    } else {
      let t;
      if (data.onchain.dataType.bytes) {
        t = 0;
      } else if (data.onchain.dataType.hex) {
        t = 1;
      } else {
        t = 2;
      }
      builder = program.methods
        .createOnchainMetadata(t, data.onchain.dataAccount)
        .accounts({
          authoritiesGroup,
          mint,
          metadata,
          tokenProgram: tokenProgram || TOKEN_2022_PROGRAM_ID,
        });
    }

    return {
      mint,
      metadata,
      authoritiesGroup,
      builder,
    };
  },
  includeInSet: ({
    provider,
    authoritiesGroup,
    parentMint,
    childMint,
    inclusionAuthority,
  }: IncludeInSetInput) => {
    const program = new Program<NftStandard>(
      IDL as any,
      NFT_STANDARD_PROGRAM_ID,
      provider
    );
    const inclusion = getInclusionKey(parentMint, childMint);

    return {
      inclusion,
      builder: program.methods.includeInSet().accounts({
        inclusionAuthority: inclusionAuthority || provider.publicKey,
        parentMetadata: getMetadataKey(parentMint),
        authoritiesGroup,
        childMetadata: getMetadataKey(childMint),
        inclusion,
      }),
    };
  },
  excludeFromSet: ({
    provider,
    authoritiesGroup,
    parentMint,
    childMint,
    inclusionAuthority,
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
      builder: program.methods.excludeFromSet().accounts({
        inclusionAuthority,
        authoritiesGroup,
        parentMetadata,
        childMetadata,
        inclusion,
      }),
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
  excludeFromSuperset: ({
    provider,
    parentMint,
    childMint,
    holder,
    tokenProgram = TOKEN_2022_PROGRAM_ID,
  }: ExcludeFromSupersetInput) => {
    const program = new Program<NftStandard>(
      IDL as any,
      NFT_STANDARD_PROGRAM_ID,
      provider
    );
    const parentMetadata = getMetadataKey(parentMint);
    const childMetadata = getMetadataKey(childMint);
    const inclusion = getSupersetInclusionKey(parentMint, childMint);

    return {
      inclusion,
      builder: program.methods.excludeFromSuperset().accounts({
        parentMetadata,
        childMetadata,
        inclusion,
        holder,
        mint: childMint,
        tokenAccount: getAssociatedTokenAddressSync(
          childMint,
          holder,
          true,
          tokenProgram
        ),
        tokenProgram,
      }),
    };
  },
};
