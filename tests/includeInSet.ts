import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { NftStandard } from "../sdk/src/idl/nft_standard";
import { expect } from "chai";
import { expectRevert } from "./utils";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { includeInSet, mintNft } from "../sdk/src";

const suiteName = "Nft Standard: Include in set";
describe(suiteName, () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.NftStandard as Program<NftStandard>;
  let values: TestValues;

  beforeEach(async () => {
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
        values.transferAuthority.publicKey,
        values.updateAuthority.publicKey,
        values.inclusionAuthority.publicKey
      )
      .accounts({
        authoritiesGroup: values.authoritiesGroupKey,
      })
      .rpc({ skipPreflight: true });

    await mintNft({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      data: values.metadataData,
      mintConfig: { keypair: values.parentMintKeypair2022 },
    });

    await mintNft({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      data: values.metadataData,
      mintConfig: { keypair: values.mintKeypair2022 },
    });
  });

  it("includes", async () => {
    const { inclusion: inclusionKey } = await includeInSet({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      parentMint: values.parentMintKeypair2022.publicKey,
      childMint: values.mintKeypair2022.publicKey,
      signers: { inclusionAuthority: values.inclusionAuthority },
    });

    const inclusion = await program.account.inclusion.fetch(inclusionKey);
    expect(inclusion).not.to.be.undefined;
  });

  it("requires inclusion authority", async () => {
    await expectRevert(
      includeInSet({
        provider,
        authoritiesGroup: values.authoritiesGroupKey,
        parentMint: values.parentMintKeypair2022.publicKey,
        childMint: values.mintKeypair2022.publicKey,
        signers: { inclusionAuthority: values.holder },
      })
    );
  });
});
