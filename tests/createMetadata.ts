import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { TestValues, createValues } from "./values";
import { NftStandard } from "../sdk/src/idl/nft_standard";
import { expect } from "chai";
import { expectRevert } from "./utils";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { mintNft } from "../sdk/src";

const suiteName = "Nft Standard: Create metadata";
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
  });

  describe("Using Token2022", () => {
    it("Creates", async () => {
      await mintNft({
        provider,
        authoritiesGroup: values.authoritiesGroupKey,
        data: values.metadataData,
        creator: values.holder.publicKey,
        keypair: values.mintKeypair2022,
        signers: [values.holder],
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      });

      const metadata = await program.account.metadata.fetch(
        values.metadata2022Key
      );

      expect(metadata.mint.toString()).to.equal(
        values.mintKeypair2022.publicKey.toString()
      );
      expect(metadata.setVersionCounter).to.equal(0);
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
  });

  describe("Using standard SPL", () => {
    it("Creates", async () => {
      await mintNft({
        provider,
        authoritiesGroup: values.authoritiesGroupKey,
        data: values.metadataData,
        creator: values.holder.publicKey,
        keypair: values.mintKeypair,
        signers: [values.holder],
        tokenProgram: TOKEN_PROGRAM_ID,
      });

      const metadata = await program.account.metadata.fetch(values.metadataKey);

      expect(metadata.mint.toString()).to.equal(
        values.mintKeypair.publicKey.toString()
      );
      expect(metadata.setVersionCounter).to.equal(0);
      expect(metadata.authoritiesGroup.toString()).to.equal(
        values.authoritiesGroupKey.toString()
      );
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
