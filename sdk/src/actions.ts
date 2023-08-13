import { Provider } from "@coral-xyz/anchor";
import {
  ConfirmOptions,
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
} from "@solana/web3.js";
import { MetadataData } from "./metadataData";
import {
  IncludeInSetInput,
  IncludeInSupersetInput,
  MintNftInput,
  builders,
} from "./builders";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  createInitializePermanentDelegateInstruction,
  getMintLen,
} from "@solana/spl-token";

export type MintSetElementInput = {
  provider: Provider;
  data: MetadataData;
  authoritiesGroup: PublicKey;
  parentMint: PublicKey;
  inclusionAuthority?: PublicKey;
  creator?: PublicKey;
  keypair?: Keypair;
  signers?: Signer[];
  confirmOptions?: ConfirmOptions;
};

export type TransactionSender = {
  confirmOptions?: ConfirmOptions;
};

export const mintNft = async ({
  confirmOptions,
  ...inputs
}: MintNftInput & TransactionSender) => {
  const { builder, mint, tokenAccount, metadata, authoritiesGroup } =
    builders.mintNft(inputs);

  if (inputs.permanentDelegate) {
    const mintLen = getMintLen([ExtensionType.PermanentDelegate]);
    await builder
      .preInstructions([
        SystemProgram.createAccount({
          fromPubkey: inputs.provider.publicKey,
          newAccountPubkey: mint,
          space: mintLen,
          lamports:
            await inputs.provider.connection.getMinimumBalanceForRentExemption(
              mintLen
            ),
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializePermanentDelegateInstruction(
          mint,
          inputs.permanentDelegate,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mint,
          0,
          inputs.creator || inputs.provider.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
      ])
      .rpc(confirmOptions);
  } else {
    await builder.rpc(confirmOptions);
  }

  return {
    mint,
    tokenAccount,
    metadata,
    authoritiesGroup,
  };
};

export const includeInSet = async ({
  confirmOptions,
  ...inputs
}: IncludeInSetInput & TransactionSender) => {
  const { builder, inclusion } = builders.includeInSet(inputs);
  await builder.rpc(confirmOptions);

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

export const mintSetElement = async ({
  provider,
  data,
  parentMint,
  authoritiesGroup,
  inclusionAuthority,
  creator = inclusionAuthority,
  keypair,
  signers,
  confirmOptions,
}: MintSetElementInput & TransactionSender) => {
  const kp = keypair || Keypair.generate();
  const {
    builder: mintBuilder,
    mint,
    tokenAccount,
    metadata,
  } = builders.mintNft({
    provider,
    authoritiesGroup,
    data,
    creator,
    keypair: kp,
  });
  const { builder, inclusion } = builders.includeInSet({
    provider,
    childMint: kp.publicKey,
    authoritiesGroup,
    parentMint,
    inclusionAuthority,
  });
  await mintBuilder
    .signers(signers || [])
    .postInstructions([await builder.instruction()])
    .rpc(confirmOptions);

  return {
    mint,
    tokenAccount,
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
