import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import { anchorClient } from ".";
import { MetadataData } from "./metadataData";
import {
  getAuthoritiesGroupKey,
  getInclusionKey,
  getMetadataKey,
  getSupersetInclusionKey,
} from "./pdas";
import { getPathBumpsFromMints } from "./superset";

export const instructions = {
  createAuthoritiesGroup: ({
    payer,
    id = Keypair.generate().publicKey,
    updateAuthority,
    metadataAuthority,
    inclusionAuthority,
  }) => {
    const authoritiesGroup = getAuthoritiesGroupKey(id);
    const ixs = [
      anchorClient.createAuthoritiesGroup(
        {
          id,
          updateAuthority,
          metadataAuthority,
          inclusionAuthority,
        },
        { payer, systemProgram: SystemProgram.programId, authoritiesGroup }
      ),
    ];

    return {
      authoritiesGroup,
      ixs,
    };
  },
  createMetadata: ({
    payer,
    authoritiesGroup,
    name,
    data,
    mint,
    tokenProgram = TOKEN_2022_PROGRAM_ID,
  }: {
    payer: PublicKey;
    authoritiesGroup: PublicKey;
    data: MetadataData;
    name: string;
    mint: PublicKey;
    tokenProgram: PublicKey;
  }) => {
    const metadata = getMetadataKey(mint);
    const accounts = {
      payer,
      authoritiesGroup,
      mint,
      metadata,
      tokenProgram: tokenProgram || TOKEN_2022_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    };
    const ixs = [];

    if (data.external) {
      ixs.push(
        anchorClient.createExternalMetadata(
          { name, uri: data.external.uri },
          accounts
        )
      );
    } else if (data.reference) {
      ixs.push(
        anchorClient.createReferenceMetadata(
          { name, metadataAccount: data.reference.metadataAccount },
          accounts
        )
      );
    } else {
      let t;
      if (data.onchain.dataType.bytes) {
        t = 0;
      } else if (data.onchain.dataType.hex) {
        t = 1;
      } else {
        t = 2;
      }
      ixs.push(
        anchorClient.createOnchainMetadata(
          { name, dataType: t, dataAccount: data.onchain.dataAccount },
          accounts
        )
      );
    }

    return {
      mint,
      metadata,
      authoritiesGroup,
      ixs,
    };
  },
  includeInSet: ({
    payer,
    authoritiesGroup,
    parentMint,
    childMint,
    inclusionAuthority,
  }: {
    payer: PublicKey;
    authoritiesGroup: PublicKey;
    parentMint: PublicKey;
    childMint: PublicKey;
    inclusionAuthority: PublicKey;
  }) => {
    const inclusion = getInclusionKey(parentMint, childMint);

    return {
      inclusion,
      ixs: [
        anchorClient.includeInSet({
          payer,
          inclusionAuthority: inclusionAuthority || payer,
          parentMetadata: getMetadataKey(parentMint),
          authoritiesGroup,
          childMetadata: getMetadataKey(childMint),
          inclusion,
          systemProgram: SystemProgram.programId,
        }),
      ],
    };
  },
  excludeFromSet: ({
    payer,
    authoritiesGroup,
    parentMint,
    childMint,
    inclusionAuthority,
  }: {
    payer: PublicKey;
    authoritiesGroup: PublicKey;
    parentMint: PublicKey;
    childMint: PublicKey;
    inclusionAuthority: PublicKey;
  }) => {
    const parentMetadata = getMetadataKey(parentMint);
    const childMetadata = getMetadataKey(childMint);
    const inclusion = getInclusionKey(parentMint, childMint);

    return {
      inclusion,
      ixs: [
        anchorClient.excludeFromSet({
          payer,
          inclusionAuthority,
          authoritiesGroup,
          parentMetadata,
          childMetadata,
          inclusion,
          systemProgram: SystemProgram.programId,
        }),
      ],
    };
  },
  includeInSuperset: ({
    payer,
    mints,
  }: {
    payer: PublicKey;
    mints: PublicKey[];
  }) => {
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
      ixs: [
        anchorClient.includeInSuperset(
          { bumps: pathBumps },
          {
            payer,
            parentMetadata,
            childMetadata,
            inclusion,
            systemProgram: SystemProgram.programId,
          }
        ),
      ],
      remainingAccounts: accounts,
    };
  },
  excludeFromSuperset: ({
    payer,
    parentMint,
    childMint,
    holder,
    tokenProgram = TOKEN_2022_PROGRAM_ID,
  }: {
    payer: PublicKey;
    parentMint: PublicKey;
    childMint: PublicKey;
    holder: PublicKey;
    tokenProgram: PublicKey;
  }) => {
    const parentMetadata = getMetadataKey(parentMint);
    const childMetadata = getMetadataKey(childMint);
    const inclusion = getSupersetInclusionKey(parentMint, childMint);

    return {
      inclusion,
      ixs: [
        anchorClient.excludeFromSuperset({
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
          systemProgram: SystemProgram.programId,
        }),
      ],
    };
  },
};
