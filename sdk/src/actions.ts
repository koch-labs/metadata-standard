import { Provider } from "@coral-xyz/anchor";
import { ConfirmOptions, Keypair, PublicKey, Signer } from "@solana/web3.js";
import { MetadataData } from "./metadataData";
import {
  ExcludeFromSupersetInput,
  IncludeInSetInput,
  IncludeInSupersetInput,
  builders,
} from "./builders";
import {
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { mintTokenInstructions } from "./utils";

export type TransactionSender = {
  confirmOptions?: ConfirmOptions;
};

export type MintConfig = {
  initializeMint?: boolean;
  mintOne?: boolean;
  mintAuthority?: PublicKey;
  receiver?: PublicKey;
  keypair?: Keypair;
  permanentDelegate?: PublicKey;
};

export type MintNftActionInput = {
  provider: Provider;
  authoritiesGroup: PublicKey;
  data: MetadataData;
  mintConfig?: MintConfig;
  signers?: {
    mintAuthority?: Signer;
  };
  tokenProgram?: PublicKey;
  confirmOptions?: ConfirmOptions;
};
export const mintNft = async ({
  provider,
  authoritiesGroup,
  data,
  mintConfig,
  signers,
  tokenProgram = TOKEN_2022_PROGRAM_ID,
  confirmOptions,
}: MintNftActionInput) => {
  mintConfig = {
    keypair: mintConfig?.keypair || Keypair.generate(),
    initializeMint: mintConfig?.initializeMint || true,
    mintOne: mintConfig?.mintOne || true,
    mintAuthority:
      signers?.mintAuthority?.publicKey ||
      mintConfig?.mintAuthority ||
      provider.publicKey,
    receiver:
      mintConfig?.receiver || mintConfig?.mintAuthority || provider.publicKey,
    ...mintConfig,
  };
  const { builder, mint, metadata } = builders.createMetadata({
    provider,
    authoritiesGroup,
    data,
    mint: mintConfig.keypair.publicKey,
    tokenProgram,
  });

  const { ixs, signers: additionalSigners } = await mintTokenInstructions({
    provider,
    mintConfig,
    tokenProgram,
    signers,
  });

  await builder
    .preInstructions(ixs)
    .signers([...additionalSigners.filter(Boolean)])
    .rpc(confirmOptions);

  return {
    mint,
    metadata,
    authoritiesGroup,
  };
};

export const includeInSet = async ({
  confirmOptions,
  ...inputs
}: IncludeInSetInput & TransactionSender) => {
  const { builder, inclusion } = builders.includeInSet(inputs);
  await builder.signers(inputs.signers).rpc(confirmOptions);

  return {
    inclusion,
  };
};

export const excludeFromSet = async ({
  confirmOptions,
  ...inputs
}: IncludeInSetInput & TransactionSender) => {
  const { builder, inclusion } = builders.excludeFromSet(inputs);
  await builder.rpc(confirmOptions);

  return { inclusion };
};

export type MintSetElementInput = {
  provider: Provider;
  parentMint: PublicKey;
  authoritiesGroup: PublicKey;
  data: MetadataData;
  mintConfig?: MintConfig;
  signers?: {
    mintAuthority?: Signer;
    inclusionAuthority?: Signer;
  };
  tokenProgram?: PublicKey;
  confirmOptions?: ConfirmOptions;
};
export const mintSetElement = async ({
  provider,
  data,
  parentMint,
  authoritiesGroup,
  mintConfig,
  signers,
  tokenProgram = TOKEN_2022_PROGRAM_ID,
  confirmOptions,
}: MintSetElementInput) => {
  mintConfig = {
    keypair: mintConfig?.keypair || Keypair.generate(),
    initializeMint: mintConfig?.initializeMint || true,
    mintOne: mintConfig?.mintOne || true,
    mintAuthority:
      signers?.mintAuthority?.publicKey ||
      mintConfig?.mintAuthority ||
      provider.publicKey,
    receiver:
      mintConfig?.receiver || mintConfig?.mintAuthority || provider.publicKey,
    ...mintConfig,
  };
  const {
    builder: mintBuilder,
    mint,
    metadata,
  } = builders.createMetadata({
    provider,
    authoritiesGroup,
    data,
    mint: mintConfig.keypair.publicKey,
  });

  const { ixs, signers: additionalSigners } = await mintTokenInstructions({
    provider,
    mintConfig,
    tokenProgram,
    signers,
  });

  const { builder, inclusion } = builders.includeInSet({
    provider,
    childMint: mint,
    authoritiesGroup,
    parentMint,
    inclusionAuthority:
      signers?.inclusionAuthority?.publicKey || provider.publicKey,
  });

  await mintBuilder
    .signers([signers.inclusionAuthority, ...additionalSigners].filter(Boolean))
    .preInstructions(ixs)
    .postInstructions([await builder.instruction()])
    .rpc(confirmOptions);

  return {
    mint,
    metadata,
    inclusion,
  };
};

export const includeInSuperset = async ({
  confirmOptions,
  ...inputs
}: IncludeInSupersetInput & TransactionSender) => {
  const { builder, inclusion } = builders.includeInSuperset(inputs);
  await builder.rpc(confirmOptions);

  return {
    inclusion,
  };
};

export const excludeFromSuperset = async ({
  confirmOptions,
  ...inputs
}: ExcludeFromSupersetInput & TransactionSender) => {
  const { builder, inclusion } = builders.excludeFromSuperset(inputs);
  await builder
    .preInstructions([
      createAssociatedTokenAccountIdempotentInstruction(
        inputs.provider.publicKey,
        getAssociatedTokenAddressSync(
          inputs.childMint,
          inputs.holder,
          true,
          inputs.tokenProgram || TOKEN_2022_PROGRAM_ID
        ),
        inputs.holder,
        inputs.childMint,
        inputs.tokenProgram || TOKEN_2022_PROGRAM_ID
      ),
    ])
    .rpc(confirmOptions);

  return {
    inclusion,
  };
};
