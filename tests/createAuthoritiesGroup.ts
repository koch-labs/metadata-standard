import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { NftStandard } from "../target/types/nft_standard";
import { expect } from "chai";
import { createAuthoritiesGroup } from "../sdk/src";

const suiteName = "Nft Standard: Create authorities group";
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
        values.metadataAuthority,
        values.inclusionAuthority,
        values.holder,
      ].map(async (kp, i) => {
        await connection.confirmTransaction(
          await connection.requestAirdrop(kp.publicKey, 10 * LAMPORTS_PER_SOL)
        );
      })
    );
  });

  it("Create a group", async () => {
    await createAuthoritiesGroup({
      provider,
      id: values.authoritiesGroupId,
      updateAuthority: values.updateAuthority.publicKey,
      metadataAuthority: values.metadataAuthority.publicKey,
      inclusionAuthority: values.inclusionAuthority.publicKey,
    });

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
      values.metadataAuthority.publicKey.toString()
    );
    expect(authoritiesGroup.inclusionAuthority.toString()).to.equal(
      values.inclusionAuthority.publicKey.toString()
    );
  });
});
