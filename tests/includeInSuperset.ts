import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

import { TestValues, createValues } from "./values";
import { NftStandard } from "../sdk/src/idl/nft_standard";
import { expect } from "chai";
import { includeInSet, mintNft } from "../sdk/src";

const suiteName = "Nft Standard: Include in superset";
describe(suiteName, () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.NftStandard as Program<NftStandard>;
  let values: TestValues;

  before(async () => {
    values = createValues();

    await Promise.all(
      [
        values.admin,
        values.transferAuthority,
        values.updateAuthority,
        values.inclusionAuthority,
        values.holder,
      ].map(async (kp, i) => {
        await connection.confirmTransaction(
          await connection.requestAirdrop(kp.publicKey, 10 * LAMPORTS_PER_SOL)
        );
      })
    );

    await program.methods
      .createAuthoritiesGroup(
        values.authoritiesGroupId,
        values.holder.publicKey,
        values.holder.publicKey,
        values.holder.publicKey
      )
      .accounts({
        authoritiesGroup: values.authoritiesGroupKey,
      })
      .rpc({ skipPreflight: true });

    await program.methods
      .createAuthoritiesGroup(
        values.parentAuthoritiesGroupId,
        values.transferAuthority.publicKey,
        values.updateAuthority.publicKey,
        values.inclusionAuthority.publicKey
      )
      .accounts({
        authoritiesGroup: values.parentAuthoritiesGroupKey,
      })
      .rpc({ skipPreflight: true });

    await mintNft({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      data: values.metadataData,
      creator: values.holder.publicKey,
      keypair: values.mintKeypair2022,
      signers: [values.holder],
    });

    await mintNft({
      provider,
      authoritiesGroup: values.parentAuthoritiesGroupKey,
      data: values.metadataData,
      creator: values.holder.publicKey,
      keypair: values.parentMintKeypair2022,
      signers: [values.holder],
    });

    await includeInSet({
      provider,
      authoritiesGroup: values.parentAuthoritiesGroupKey,
      parentMint: values.parentMintKeypair2022.publicKey,
      childMint: values.mintKeypair2022.publicKey,
      inclusionAuthority: values.inclusionAuthority.publicKey,
      signers: [values.inclusionAuthority],
    });
  });

  it("includes", async () => {
    await program.methods
      .includeInSuperset(values.pathBumps)
      .accounts({
        parentMetadata: values.parentMetadata2022Key,
        childMetadata: values.metadata2022Key,
        inclusion: values.supersetInclusionKey,
      })
      .remainingAccounts([
        {
          pubkey: values.parentMetadata2022Key,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: values.inclusionKey,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: values.metadata2022Key,
          isSigner: false,
          isWritable: false,
        },
      ])
      .rpc({ skipPreflight: true });

    const inclusion = await program.account.supersetInclusion.fetch(
      values.supersetInclusionKey
    );
    expect(inclusion).not.to.be.undefined;
  });
});
