import { Provider } from "@coral-xyz/anchor";
import { ConfirmOptions, Keypair, PublicKey, Signer } from "@solana/web3.js";
import { MetadataData } from "./metadataData";
import {
  CreateAuthoritiesGroupInput,
  ExcludeFromSupersetInput,
  IncludeInSupersetInput,
  MetadataInput,
  builders,
} from "./builders";
import {
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { mintTokenInstructions } from "./utils";
import { Metadata } from "./generated";

export type TransactionSender = {
  confirmOptions?: ConfirmOptions;
};

export type CreateAuthoritiesGroupActionInput = CreateAuthoritiesGroupInput &
  TransactionSender;
export const createAuthoritiesGroup = async ({
  provider,
  id,
  updateAuthority,
  metadataAuthority,
  inclusionAuthority,
  confirmOptions,
}: CreateAuthoritiesGroupActionInput) => {
  const { builder, authoritiesGroup } = builders.createAuthoritiesGroup({
    provider,
    id,
    updateAuthority,
    metadataAuthority,
    inclusionAuthority,
  });

  await builder.rpc(confirmOptions);

  return { authoritiesGroup };
};

export type MintConfig = {
  initializeMint?: boolean;
  mintOne?: boolean;
  mintAuthority?: PublicKey;
  receiver?: PublicKey;
  keypair?: Keypair;
  permanentDelegate?: PublicKey;
};

export type MintNftActionInput = MetadataInput & {
  provider: Provider;
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
  name,
  contentHash,
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
    name,
    contentHash,
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

export type UpdateMetadataActionInput = {
  provider: Provider;
  signers?: { metadataAuthority?: Signer };
  confirmOptions?: ConfirmOptions;
};
export const updateMetadata = async ({
  provider,
  authoritiesGroup,
  mint,
  name,
  contentHash,
  data,
  signers,
  confirmOptions,
}: MetadataInput & UpdateMetadataActionInput) => {
  const { builder, metadata } = builders.updateMetadata({
    provider,
    authoritiesGroup,
    mint,
    name,
    data,
    contentHash,
    metadataAuthority:
      signers?.metadataAuthority?.publicKey || provider.publicKey,
  });
  await builder
    .signers(signers?.metadataAuthority ? [signers.metadataAuthority] : [])
    .rpc(confirmOptions);

  return {
    metadata,
  };
};

export type CloseMetadataActionInput = {
  provider: Provider;
  mint: PublicKey;
  tokenProgram?: PublicKey;
  signers?: { holder?: Signer };
  confirmOptions?: ConfirmOptions;
};
export const closeMetadata = async ({
  provider,
  mint,
  tokenProgram,
  signers,
  confirmOptions,
}: CloseMetadataActionInput) => {
  const { builder, metadata } = builders.closeMetadata({
    provider,
    mint,
    holder: signers.holder.publicKey || provider.publicKey,
    tokenProgram,
  });
  await builder
    .signers(signers?.holder ? [signers.holder] : [])
    .rpc(confirmOptions);

  return {
    metadata,
  };
};

export type IncludeInSetActionInput = {
  provider: Provider;
  authoritiesGroup: PublicKey;
  parentMint: PublicKey;
  childMint: PublicKey;
  signers?: { inclusionAuthority?: Signer };
  confirmOptions?: ConfirmOptions;
};
export const includeInSet = async ({
  provider,
  authoritiesGroup,
  parentMint,
  childMint,
  signers,
  confirmOptions,
}: IncludeInSetActionInput) => {
  const { builder, inclusion } = builders.includeInSet({
    provider,
    authoritiesGroup,
    parentMint,
    childMint,
    inclusionAuthority:
      signers?.inclusionAuthority?.publicKey || provider.publicKey,
  });
  await builder
    .signers(signers?.inclusionAuthority ? [signers.inclusionAuthority] : [])
    .rpc(confirmOptions);

  return {
    inclusion,
  };
};

export const excludeFromSet = async ({
  confirmOptions,
  provider,
  parentMint,
  childMint,
  authoritiesGroup,
  signers,
}: IncludeInSetActionInput) => {
  const { builder, inclusion } = builders.excludeFromSet({
    provider,
    parentMint,
    childMint,
    authoritiesGroup,
    inclusionAuthority: signers?.inclusionAuthority?.publicKey,
  });
  await builder
    .signers(signers?.inclusionAuthority ? [signers.inclusionAuthority] : [])
    .rpc(confirmOptions);

  return { inclusion };
};

export type MintSetElementInput = {
  provider: Provider;
  parentMint: PublicKey;
  authoritiesGroup: PublicKey;
  name: string;
  contentHash?: number[];
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
  name,
  contentHash,
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
    name,
    contentHash,
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

  const { builder, inclusion } = builders.includeInSet({
    provider,
    childMint: mint,
    authoritiesGroup,
    parentMint,
    inclusionAuthority: signers?.inclusionAuthority?.publicKey,
  });

  await mintBuilder
    .preInstructions(ixs)
    .postInstructions([await builder.instruction()])
    .signers(
      [signers?.inclusionAuthority, ...additionalSigners].filter(Boolean)
    )
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
