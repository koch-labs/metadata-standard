import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { MetadataStandard } from "../sdk/src/generated/metadataStandard";
import { expect } from "chai";
import { expectRevert } from "./utils";
import {
  createAuthoritiesGroup,
  includeInSet,
  mintNft,
  updateMetadata,
} from "../sdk/src";

const suiteName = "Nft Standard: Update metadata";
describe(suiteName, () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace
    .MetadataStandard as Program<MetadataStandard>;
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

    await createAuthoritiesGroup({
      provider,
      id: values.authoritiesGroupId,
      updateAuthority: values.updateAuthority.publicKey,
      metadataAuthority: values.metadataAuthority.publicKey,
      inclusionAuthority: values.inclusionAuthority.publicKey,
    });

    await mintNft({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      name: values.metadataName,
      data: values.metadataData,
      mintConfig: { keypair: values.mintKeypair2022 },
    });
  });

  it("update metadata", async () => {
    const newName = "okokok";
    const { metadata: metadataKey } = await updateMetadata({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      mint: values.mintKeypair2022.publicKey,
      name: newName,
      data: values.metadataData,
      signers: { metadataAuthority: values.metadataAuthority },
      confirmOptions: { skipPreflight: true },
    });

    const metadata = await program.account.metadata.fetch(metadataKey);
    expect(metadata.name).to.equal(newName);
    expect(metadata).not.to.be.undefined;
  });

  it("requires metadata authority", async () => {
    await expectRevert(
      updateMetadata({
        provider,
        authoritiesGroup: values.authoritiesGroupKey,
        name: values.metadataName,
        mint: values.mintKeypair2022.publicKey,
        data: values.metadataData,
        signers: { metadataAuthority: values.holder },
      })
    );
  });
});
