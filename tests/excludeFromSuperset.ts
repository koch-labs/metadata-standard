import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { NftStandard } from "../sdk/src/idl/nft_standard";
import { expectRevert } from "./utils";
import {
  excludeFromSet,
  excludeFromSuperset,
  includeInSet,
  includeInSuperset,
  mintNft,
  mintSetElement,
} from "../sdk/src";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

const suiteName = "Nft Standard: Exclude from superset";
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

    await mintSetElement({
      provider,
      authoritiesGroup: values.authoritiesGroupKey,
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
