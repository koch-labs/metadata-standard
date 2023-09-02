import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { MetadataStandard } from "../sdk/src/generated/metadataStandard";
import { expect } from "chai";
import { expectRevert } from "./utils";
import {
  closeMetadata,
  createAuthoritiesGroup,
  includeInSet,
  mintNft,
  updateMetadata,
} from "../sdk/src";

const suiteName = "Nft Standard: Close metadata";
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
      data: values.metadataData,
      mintConfig: {
        keypair: values.mintKeypair2022,
        receiver: values.holder.publicKey,
      },
    });
  });

  it("closes metadata", async () => {
    const { metadata: metadataKey } = await closeMetadata({
      provider,
      mint: values.mintKeypair2022.publicKey,
      signers: { holder: values.holder },
      confirmOptions: { skipPreflight: true },
    });

    await expectRevert(program.account.metadata.fetch(metadataKey));
  });

  it("recreates metadata", async () => {
    const { metadata: metadataKey } = await closeMetadata({
      provider,
      mint: values.mintKeypair2022.publicKey,
      signers: { holder: values.holder },
      confirmOptions: { skipPreflight: true },
    });

    await mintNft({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      data: values.metadataData,
      mintConfig: {
        keypair: values.mintKeypair2022,
        mintOne: false,
        initializeMint: false,
      },
      confirmOptions: { skipPreflight: true },
    });

    const metadata = await program.account.metadata.fetch(metadataKey);
    expect(metadata).to.not.be.undefined;
  });
});
