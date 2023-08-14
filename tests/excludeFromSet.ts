import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { NftStandard } from "../sdk/src/idl/nft_standard";
import { expectRevert } from "./utils";
import {
  createAuthoritiesGroup,
  excludeFromSet,
  includeInSet,
  mintNft,
  mintSetElement,
} from "../sdk/src";

const suiteName = "Nft Standard: Exclude from set";
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

    await createAuthoritiesGroup({
      provider,
      id: values.authoritiesGroupId,
      updateAuthority: values.updateAuthority.publicKey,
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

  it("excludes", async () => {
    const { inclusion: inclusionKey } = await excludeFromSet({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
      parentMint: values.parentMintKeypair2022.publicKey,
      childMint: values.mintKeypair2022.publicKey,
      signers: { inclusionAuthority: values.inclusionAuthority },
      confirmOptions: { skipPreflight: true },
    });

    await expectRevert(program.account.inclusion.fetch(inclusionKey));
  });

  it("requires inclusion authority", async () => {
    await expectRevert(
      excludeFromSet({
        provider,
        authoritiesGroup: values.parentAuthoritiesGroupKey,
        parentMint: values.parentMintKeypair2022.publicKey,
        childMint: values.mintKeypair2022.publicKey,
        signers: { inclusionAuthority: values.holder },
        confirmOptions: { skipPreflight: true },
      })
    );
  });
});
