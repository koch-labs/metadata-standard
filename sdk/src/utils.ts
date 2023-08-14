import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMintInstruction,
  createInitializePermanentDelegateInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddressSync,
  getMintLen,
} from "@solana/spl-token";
import { PublicKey, Signer, SystemProgram } from "@solana/web3.js";
import { MintConfig } from "./actions";
import { Provider } from "@coral-xyz/anchor";

export const mintTokenInstructions = async ({
  provider,
  mintConfig,
  tokenProgram,
  signers,
}: {
  provider: Provider;
  mintConfig: MintConfig;
  tokenProgram: PublicKey;
  signers?: { mintAuthority?: Signer };
}) => {
  const additionalSigners = [];

  let initIx = [];
  if (mintConfig?.initializeMint !== false) {
    additionalSigners.push(mintConfig?.keypair);

    if (tokenProgram.equals(TOKEN_2022_PROGRAM_ID)) {
      const extensions = [];
      if (mintConfig?.permanentDelegate) {
        extensions.push(ExtensionType.PermanentDelegate);
        initIx.push(
          createInitializePermanentDelegateInstruction(
            mintConfig.keypair.publicKey,
            mintConfig.permanentDelegate,
            tokenProgram
          )
        );
      }
      const mintLen = getMintLen(extensions);

      initIx = [
        SystemProgram.createAccount({
          fromPubkey: provider.publicKey,
          newAccountPubkey: mintConfig.keypair.publicKey,
          space: mintLen,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(
            mintLen
          ),
          programId: tokenProgram,
        }),
        ...initIx,
        createInitializeMintInstruction(
          mintConfig.keypair.publicKey,
          0,
          mintConfig.mintAuthority,
          mintConfig.mintAuthority,
          tokenProgram
        ),
      ];
    } else {
      initIx.push(
        SystemProgram.createAccount({
          fromPubkey: provider.publicKey,
          newAccountPubkey: mintConfig.keypair.publicKey,
          space: getMintLen([]),
          lamports: await provider.connection.getMinimumBalanceForRentExemption(
            getMintLen([])
          ),
          programId: tokenProgram,
        }),
        createInitializeMintInstruction(
          mintConfig.keypair.publicKey,
          0,
          mintConfig.mintAuthority,
          mintConfig.mintAuthority,
          tokenProgram
        )
      );
    }
  }

  let mintIx = [];
  if (mintConfig?.mintOne !== false) {
    additionalSigners.push(signers?.mintAuthority);
    mintIx.push(
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        getAssociatedTokenAddressSync(
          mintConfig.keypair.publicKey,
          mintConfig.receiver,
          true,
          tokenProgram
        ),
        mintConfig.receiver,
        mintConfig.keypair.publicKey,
        tokenProgram
      ),
      createMintToCheckedInstruction(
        mintConfig.keypair.publicKey,
        getAssociatedTokenAddressSync(
          mintConfig.keypair.publicKey,
          mintConfig.receiver,
          true,
          tokenProgram
        ),
        mintConfig.mintAuthority,
        1,
        0,
        undefined,
        tokenProgram
      )
    );
  }

  return {
    ixs: [...initIx, ...mintIx],
    signers: additionalSigners,
  };
};
