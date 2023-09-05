import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { MetadataStandard } from "../sdk/src/generated/metadataStandard";
import { expectRevert } from "./utils";
import {
  createAuthoritiesGroup,
  excludeFromSuperset,
  includeInSuperset,
  mintNft,
  mintSetElement,
} from "../sdk/src";

const suiteName = "Nft Standard: Exclude from superset";
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
      mintConfig: { keypair: values.parentMintKeypair2022 },
    });

    await mintSetElement({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      name: values.metadataName,
      data: values.metadataData,
      parentMint: values.parentMintKeypair2022.publicKey,
      mintConfig: {
        keypair: values.mintKeypair2022,
        receiver: values.holder.publicKey,
      },
      signers: { inclusionAuthority: values.inclusionAuthority },
      confirmOptions: { skipPreflight: true },
    });

    await includeInSuperset({
      provider,
      mints: [
        values.parentMintKeypair2022.publicKey,
        values.mintKeypair2022.publicKey,
      ],
      confirmOptions: { skipPreflight: true },
    });
  });

  it("excludes", async () => {
    const { inclusion: inclusionKey } = await excludeFromSuperset({
      provider,
      parentMint: values.parentMintKeypair2022.publicKey,
      childMint: values.mintKeypair2022.publicKey,
      holder: values.holder.publicKey,
      confirmOptions: { skipPreflight: true },
    });

    await expectRevert(program.account.supersetInclusion.fetch(inclusionKey));
  });
});
