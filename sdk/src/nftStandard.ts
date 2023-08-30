import { Program, Provider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { getMetadataKey } from "./pdas";
import { getProgram } from "./utils";
import { MetadataStandard } from "./generated/metadataStandard";

export class KochStandard {
  provider: Provider;
  program: Program<MetadataStandard>;

  constructor(provider: Provider) {
    this.provider = provider;
    this.program = getProgram(provider);
  }

  metadata() {
    return new MetadataHelper(this);
  }
}

export class MetadataHelper {
  standard: KochStandard;

  constructor(standard: KochStandard) {
    this.standard = standard;
  }

  async fetch(mint: PublicKey) {
    const account = await this.standard.program.account.metadata.fetch(
      getMetadataKey(mint)
    );

    return account;
  }
}
