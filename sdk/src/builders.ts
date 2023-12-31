import { Provider, Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import { MetadataStandard } from "./generated/metadataStandard";
import IDL from "./generated/idl.json";
import { MetadataData } from "./metadataData";
import {
  getAuthoritiesGroupKey,
  getInclusionKey,
  getMetadataKey,
  getSupersetInclusionKey,
} from "./pdas";
import { getPathBumpsFromMints } from "./superset";
import { getProgram } from "./utils";

export type MetadataInput = {
  authoritiesGroup: PublicKey;
  mint?: PublicKey;
  name: string;
  contentHash?: number[];
  data: MetadataData;
};
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
  mintAuthority: PublicKey;
  name: string;
  data: MetadataData;
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
    const program = getProgram(provider);
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
    mintAuthority,
    authoritiesGroup,
    name,
    contentHash,
    data,
    mint,
    tokenProgram = TOKEN_2022_PROGRAM_ID,
  }: MetadataInput & MintNftInput) => {
    const program = getProgram(provider);
    const metadata = getMetadataKey(mint);

    let builder;
    if (data.external) {
      builder = program.methods
        .createExternalMetadata(name, contentHash, data.external.uri)
        .accounts({
          authoritiesGroup,
          mintAuthority,
          mint,
          metadata,
          tokenProgram: tokenProgram || TOKEN_2022_PROGRAM_ID,
        });
    } else if (data.reference) {
      builder = program.methods
        .createReferenceMetadata(
          name,
          contentHash,
          data.reference.metadataAccount
        )
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
        .createOnchainMetadata(name, contentHash, t, data.onchain.dataAccount)
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
  updateMetadata: ({
    provider,
    authoritiesGroup,
    mint,
    name,
    contentHash,
    data,
    metadataAuthority = provider.publicKey,
  }: MetadataInput & {
    provider: Provider;
    data: MetadataData;
    metadataAuthority: PublicKey;
  }) => {
    const program = getProgram(provider);
    const metadata = getMetadataKey(mint);

    let builder;
    if (data.external) {
      builder = program.methods
        .updateExternalMetadata(name, contentHash, data.external.uri)
        .accounts({
          metadataAuthority,
          authoritiesGroup,
          metadata,
        });
    } else if (data.reference) {
      builder = program.methods
        .updateReferenceMetadata(
          name,
          contentHash,
          data.reference.metadataAccount
        )
        .accounts({
          metadataAuthority,
          authoritiesGroup,
          metadata,
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
        .updateOnchainMetadata(name, contentHash, t, data.onchain.dataAccount)
        .accounts({
          metadataAuthority,
          authoritiesGroup,
          metadata,
        });
    }

    return {
      metadata,
      builder,
    };
  },
  closeMetadata: ({
    provider,
    mint,
    holder = provider.publicKey,
    tokenProgram = TOKEN_2022_PROGRAM_ID,
  }: {
    provider: Provider;
    mint: PublicKey;
    holder: PublicKey;
    tokenProgram: PublicKey;
  }) => {
    const program = getProgram(provider);
    const metadata = getMetadataKey(mint);
    const mintAccount = getAssociatedTokenAddressSync(
      mint,
      holder,
      true,
      tokenProgram
    );

    return {
      metadata,
      builder: program.methods.closeMetadata().accounts({
        holder,
        mint,
        mintAccount,
        metadata,
        tokenProgram,
      }),
    };
  },
  includeInSet: ({
    provider,
    authoritiesGroup,
    parentMint,
    childMint,
    inclusionAuthority,
  }: IncludeInSetInput) => {
    const program = getProgram(provider);
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
    const program = getProgram(provider);
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
    const program = getProgram(provider);
    const pathBumps = getPathBumpsFromMints(mints);
    const parentMetadata = getMetadataKey(mints[0]);
    const childMetadata = getMetadataKey(mints[mints.length - 1]);
    const inclusion = getSupersetInclusionKey(
      mints[0],
      mints[mints.length - 1]
    );
    const accounts = [
      {
        pubkey: parentMetadata,
        isSigner: false,
        isWritable: false,
      },
    ];
    for (let i = 0; i < mints.length - 1; i++) {
      accounts.push(
        {
          pubkey: getInclusionKey(mints[i], mints[i + 1]),
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: getMetadataKey(mints[i + 1]),
          isSigner: false,
          isWritable: false,
        }
      );
    }

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
    const program = getProgram(provider);
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
