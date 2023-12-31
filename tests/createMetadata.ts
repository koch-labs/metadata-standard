import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { createMint, transferChecked } from "@solana/spl-token";

import { TestValues, createValues } from "./values";
import { MetadataStandard } from "../sdk/src/generated/metadataStandard";
import { expect } from "chai";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { createAuthoritiesGroup, mintNft } from "../sdk/src";
import { expectRevert } from "./utils";

const suiteName = "Nft Standard: Create metadata";
describe(suiteName, () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace
    .MetadataStandard as Program<MetadataStandard>;
  let values: TestValues;

  const initialize = async () => {
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
  };

  describe("Using Token2022", () => {
    beforeEach(initialize);

    it("creates metadata", async () => {
      await mintNft({
        provider,
        authoritiesGroup: values.authoritiesGroupKey,
        name: values.metadataName,
        contentHash: values.metadataHash,
        data: values.metadataData,
        mintConfig: {
          keypair: values.mintKeypair2022,
          receiver: values.holder.publicKey,
        },
        confirmOptions: { skipPreflight: true },
      });

      const metadata = await program.account.metadata.fetch(
        values.metadata2022Key
      );

      expect(metadata.mint.toString()).to.equal(
        values.mintKeypair2022.publicKey.toString()
      );
      expect(metadata.authoritiesGroup.toString()).to.equal(
        values.authoritiesGroupKey.toString()
      );
      expect(metadata.data.toString()).to.equal(values.metadataData.toString());

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        values.admin,
        values.mintKeypair2022.publicKey,
        values.holder.publicKey,
        true,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );

      expect(tokenAccount.amount.toString()).to.equal("1");
      expect(tokenAccount.mint.toString()).to.equal(
        values.mintKeypair2022.publicKey.toString()
      );
    });

    it("works with a permanent delegate", async () => {
      await mintNft({
        provider,
        authoritiesGroup: values.authoritiesGroupKey,
        name: values.metadataName,
        data: values.metadataData,
        mintConfig: {
          permanentDelegate: values.admin.publicKey,
          keypair: values.mintKeypair2022,
          receiver: values.holder.publicKey,
        },
        confirmOptions: { skipPreflight: true },
      });

      let tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        values.admin,
        values.mintKeypair2022.publicKey,
        values.admin.publicKey,
        true,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      await transferChecked(
        connection,
        values.admin,
        values.holderMintAccount2022,
        values.mintKeypair2022.publicKey,
        tokenAccount.address,
        values.admin,
        1,
        0,
        undefined,
        { skipPreflight: true },
        TOKEN_2022_PROGRAM_ID
      );

      tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        values.admin,
        values.mintKeypair2022.publicKey,
        values.admin.publicKey,
        true,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );

      expect(tokenAccount.amount.toString()).to.equal("1");
      expect(tokenAccount.mint.toString()).to.equal(
        values.mintKeypair2022.publicKey.toString()
      );
    });

    it("fails when not created by the mint authority", async () => {
      await createMint(
        connection,
        values.admin,
        values.inclusionAuthority.publicKey,
        values.inclusionAuthority.publicKey,
        0,
        values.mintKeypair2022,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      await expectRevert(
        mintNft({
          provider,
          authoritiesGroup: values.authoritiesGroupKey,
          name: values.metadataName,
          data: values.metadataData,
          mintConfig: {
            permanentDelegate: values.admin.publicKey,
            keypair: values.mintKeypair2022,
            receiver: values.holder.publicKey,
          },
          signers: { mintAuthority: values.admin },
          confirmOptions: { skipPreflight: true },
        })
      );
    });
  });

  describe("Using standard SPL", () => {
    beforeEach(initialize);

    it("Creates", async () => {
      await mintNft({
        provider,
        authoritiesGroup: values.authoritiesGroupKey,
        name: values.metadataName,
        data: values.metadataData,
        mintConfig: {
          keypair: values.mintKeypair,
          receiver: values.holder.publicKey,
        },
        tokenProgram: TOKEN_PROGRAM_ID,
      });

      const metadata = await program.account.metadata.fetch(values.metadataKey);

      expect(metadata.mint.toString()).to.equal(
        values.mintKeypair.publicKey.toString()
      );
      expect(metadata.authoritiesGroup.toString()).to.equal(
        values.authoritiesGroupKey.toString()
      );
      expect(metadata.name).to.equal(values.metadataName);
      expect(metadata.data.toString()).to.equal(values.metadataData.toString());

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        values.admin,
        values.mintKeypair.publicKey,
        values.holder.publicKey,
        true,
        undefined,
        undefined,
        TOKEN_PROGRAM_ID
      );

      expect(tokenAccount.amount.toString()).to.equal("1");
      expect(tokenAccount.mint.toString()).to.equal(
        values.mintKeypair.publicKey.toString()
      );
    });
  });
});
