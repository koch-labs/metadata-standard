import { Program, Provider } from "@coral-xyz/anchor";
import IDL from "./idl/nft_standard.json";
import { NftStandard } from "./idl/nft_standard";
import { NFT_STANDARD_PROGRAM_ID } from "./constants";
import { PublicKey } from "@solana/web3.js";
import { getMetadataKey } from "./pdas";

export class KochStandard {
  provider: Provider;
  program: Program<NftStandard>;

  constructor(provider: Provider) {
    this.provider = provider;
    this.program = new Program<NftStandard>(
      IDL as any,
      NFT_STANDARD_PROGRAM_ID,
      provider
    );
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
