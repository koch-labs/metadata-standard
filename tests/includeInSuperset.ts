import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { MetadataStandard } from "../sdk/src/generated/metadataStandard";
import { expect } from "chai";
import {
  createAuthoritiesGroup,
  includeInSuperset,
  mintNft,
  mintSetElement,
} from "../sdk/src";

const suiteName = "Nft Standard: Include in superset";
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
      metadataAuthority: values.metadataAuthority.publicKey,
      inclusionAuthority: values.inclusionAuthority.publicKey,
    });

    await mintNft({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      data: values.metadataData,
      mintConfig: { keypair: values.parentMintKeypair2022 },
    });

    await mintSetElement({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      data: values.metadataData,
      parentMint: values.parentMintKeypair2022.publicKey,
      mintConfig: { keypair: values.mintKeypair2022 },
      signers: { inclusionAuthority: values.inclusionAuthority },
      confirmOptions: { skipPreflight: true },
    });
  });

  it("includes", async () => {
    const { inclusion: inclusionKey } = await includeInSuperset({
      provider,
      mints: [
        values.parentMintKeypair2022.publicKey,
        values.mintKeypair2022.publicKey,
      ],
      confirmOptions: { skipPreflight: true },
    });

    const inclusion = await program.account.supersetInclusion.fetch(
      inclusionKey
    );
    expect(inclusion).not.to.be.undefined;
  });
});
