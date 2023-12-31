import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { MetadataStandard } from "../sdk/src/generated/metadataStandard";
import { expect } from "chai";
import { expectRevert } from "./utils";
import { createAuthoritiesGroup } from "../sdk/src";

const suiteName = "Nft Standard: Update authorities group";
describe(suiteName, () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace
    .MetadataStandard as Program<MetadataStandard>;
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

    await createAuthoritiesGroup({
      provider,
      id: values.authoritiesGroupId,
      updateAuthority: values.updateAuthority.publicKey,
      metadataAuthority: values.updateAuthority.publicKey,
      inclusionAuthority: values.inclusionAuthority.publicKey,
    });
  });

  it("Updates", async () => {
    await program.methods
      .updateAuthoritiesGroup(
        values.updateAuthority.publicKey,
        values.updateAuthority.publicKey,
        values.updateAuthority.publicKey
      )
      .accounts({
        updateAuthority: values.updateAuthority.publicKey,
        authoritiesGroup: values.authoritiesGroupKey,
      })
      .signers([values.updateAuthority])
      .rpc({ skipPreflight: true });

    const authoritiesGroup = await program.account.authoritiesGroup.fetch(
      values.authoritiesGroupKey
    );

    expect(authoritiesGroup.id.toString()).to.equal(
      values.authoritiesGroupId.toString()
    );
    expect(authoritiesGroup.updateAuthority.toString()).to.equal(
      values.updateAuthority.publicKey.toString()
    );
    expect(authoritiesGroup.metadataAuthority.toString()).to.equal(
      values.updateAuthority.publicKey.toString()
    );
    expect(authoritiesGroup.inclusionAuthority.toString()).to.equal(
      values.updateAuthority.publicKey.toString()
    );
  });

  it("Only works when update authority is a signer", async () => {
    await expectRevert(
      program.methods
        .updateAuthoritiesGroup(
          values.transferAuthority.publicKey,
          values.transferAuthority.publicKey,
          values.transferAuthority.publicKey
        )
        .accounts({
          updateAuthority: values.transferAuthority.publicKey,
          authoritiesGroup: values.authoritiesGroupKey,
        })
        .signers([values.transferAuthority])
        .rpc({ skipPreflight: true })
    );
  });
});
